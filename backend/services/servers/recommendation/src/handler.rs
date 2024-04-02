use std::sync::Arc;
use futures::future::try_join_all;

use axum::{
    extract::{Query, State}, http::StatusCode, response::IntoResponse, Json
};
use utoipa::OpenApi;

use crate::{
    model::{MinimalReviewModel, Recommendation, RecommendationWithFreshness, RecommendationError},
    schema::ReviewFilterOptions,
    AppState, ApiDoc
};

#[utoipa::path(
    get,
    path = "/api/healthcheck",
    tag = "health",
    responses(
        (status = 200, description = "Recommender API healthy")
    )
)]
pub async fn health_check() -> impl IntoResponse {
    const RESPONSE: &str = "Recommender API";

    let json_response = serde_json::json!({
        "status": "success",
        "message": RESPONSE
    });

    Json(json_response)
}

#[utoipa::path(
    get,
    path = "/recommendation_swagger.json",
    tag = "util",
    responses(
        (status = 200, description = "JSON file", body = ())
    )
)]
pub async fn serve_swagger() -> impl IntoResponse {
    Json(ApiDoc:: openapi())
}

#[utoipa::path(
    get,
    path = "/api/recommendation",
    tag = "recommender",
    responses(
        (status = 200, description = "Recommendation for single university retrieved", body = RecommendationWithFreshness),
        (status = 500, description = "Internal server error", body = RecommendationError),
        (status = 502, description = "External API error", body = RecommendationError)
    ),
    params(
        ("university_name" = String, description = "university name")
    )
)]
pub async fn get_recommendation_score(
    opts: Option<Query<ReviewFilterOptions>>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let university_name = opts
                                .and_then(|o| o.university_name.clone())
                                .expect("university_name must be set");

    let app_state = data.as_ref();

    let api_url = app_state.api_url.clone();

    if let Some(cached_rating) = app_state.rating_cache.get_valid_rating(&university_name) {
        // let json_response = serde_json::json!({
        //     "status": "success",
        //     "fresh": false,
        //     "rating": cached_rating
        // });

        return Ok(Json(RecommendationWithFreshness {
            success: true,
            fresh: true,
            rating: cached_rating
        }));
    }

    let client = reqwest::Client::new();

    let request_url = format!("{}/reviews/recommendation/{}", api_url, university_name);

    let response = client
                            .get(&request_url)
                            .send()
                            .await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                match resp.json::<Vec<MinimalReviewModel>>().await {
                    Ok(reviews) => {
                        // println!("{:?}", reviews);

                        let rating = app_state.rating_cache.get_rating(&university_name, &reviews);
        
                        // let json_response = serde_json::json!({
                        //     "status": "success",
                        //     "fresh": true,
                        //     "rating": rating  
                        // });
        
                        Ok(Json(RecommendationWithFreshness {
                            success: true,
                            fresh: true,
                            rating
                        }))
                    },
                    Err(_) => {
                        let error_response = serde_json::json!(RecommendationError {
                            success: false,
                            message: "failed to deserialize reviews".to_string()
                        });
                
                        return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
                    }
                }
            } else {
                let error_response = serde_json::json!(RecommendationError {
                    success: false,
                    message: "error fetching review from API".to_string()
                });
        
                return Err((StatusCode::BAD_GATEWAY, Json(error_response)));
            }
        },
        Err(_) => {
            let error_response = serde_json::json!(RecommendationError {
                success: false,
                message: "error fetching review from API".to_string()
            });
    
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
        }
    }
}


#[utoipa::path(
    get,
    path = "/api/recommendation_all",
    tag = "recommender",
    responses(
        (status = 200, description = "Recommendation for all universities retrieved", body = [Recommendation]),
        (status = 500, description = "Internal server error", body = RecommendationError),
        (status = 502, description = "External API error", body = RecommendationError)
    ),

)]
pub async fn get_recommendation_score_all(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    let app_state = data.as_ref();

    let api_url = app_state.api_url.clone();
    let client = reqwest::Client::new();

    let all_unis_req_url = format!("{}/universities/all", api_url);

    let all_uni_resp = client.get(&all_unis_req_url).send().await;

    match all_uni_resp {
        Ok(all_unis) => {
            if all_unis.status().is_success() {
                match all_unis.json::<Vec<String>>().await {
                    Ok(all_unis_array) => {
                        // println!("{:?}", all_unis_array);

                        let score_futures = all_unis_array.into_iter().map(|name| {
                            let client_ref = &client;
                            let url = api_url.clone();

                            async move {
                                let request_url = format!("{}/reviews/recommendation/{}", url, name);
                                let response = client_ref
                                    .get(&request_url)
                                    .send()
                                    .await;
                    
                                match response {
                                    Ok(resp) if resp.status().is_success() => {
                                        match resp.json::<Vec<MinimalReviewModel>>().await {
                                            Ok(reviews) => {
                                                let rating = app_state.rating_cache.get_rating(&name, &reviews);
                    
                                                Ok(Recommendation {
                                                    name,
                                                    success: true,
                                                    rating,
                                                })
                                            }
                                            Err(_) => Err("Failed to parse reviews"),
                                        }
                                    }
                                    _ => Err("Failed to fetch reviews"),
                                }
                            }
                        });
                    
                        match try_join_all(score_futures).await {
                            Ok(scores) => Ok(Json(scores)),
                            Err(e) => {
                                let error_response = serde_json::json!(RecommendationError {
                                    success: false,
                                    message: e.to_string()
                                });
                        
                                return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
                            }
                        }

                    },
                    Err(_) => {
                        let error_response = serde_json::json!(RecommendationError {
                            success: false,
                            message: "could not deserialize all universities".to_string()
                        });
                
                        return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
                    }
                }
            } else {
                let error_response = serde_json::json!(RecommendationError {
                    success: false,
                    message: "could not fetch all universities from API".to_string()
                });
        
                return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
            }
        },
        Err(_) => {
            let error_response = serde_json::json!(RecommendationError {
                success: false,
                message: "could not reach universities API".to_string()
            });
    
            return Err((StatusCode::BAD_GATEWAY, Json(error_response)));
        }
    }
}