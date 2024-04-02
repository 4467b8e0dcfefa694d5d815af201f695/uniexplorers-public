mod handler;
mod route;
mod model;
mod schema;
mod util;

use std::sync::Arc;

use axum::http::{
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
    HeaderValue, Method
};

use utoipa::OpenApi;

use utoipa_swagger_ui::SwaggerUi;

use route::create_router;
use util::RatingCache;
use tower_http::cors::CorsLayer;

pub struct AppState {
    rating_cache: RatingCache,
    api_url: String
}

#[derive(OpenApi)]
#[openapi(
    paths(
        handler::health_check,
        handler::get_recommendation_score,
        handler::get_recommendation_score_all
    ),
    components(
        schemas(
            model::Recommendation, 
            model::RecommendationWithFreshness, 
            model::RecommendationError
        )
    ),
    tags(
        (name = "recommender", description = "Recommender API"),
        (name = "health", description = "Healthcheck"),
        (name = "utility", description = "Utility")
    )
)]
pub struct ApiDoc;

#[tokio::main]
async fn main() {
    // dotenv().ok(); // can comment out when deployed in container
    let env_key = "UNI_API_URL";

    match std::env::var(env_key) {
        Ok(val) => {
            println!("{}: {:?}", env_key, val);

            let cors = CorsLayer::new()
            .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
            .allow_methods([Method::GET])
            .allow_credentials(true)
            .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);
    
            let app = create_router(
                Arc::new(
                    AppState { 
                        rating_cache: RatingCache::new(0.01),
                        api_url: val
                    }
                )
            )
            .merge(SwaggerUi::new("/docs").url("/docs/openapi.json", ApiDoc::openapi()))
            .layer(cors);
        
            println!("Server started successfully!");
        
            let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
            axum::serve(listener, app).await.unwrap();
        },
        Err(e) => {
            println!("Environment variable {} does not exist: {}", env_key, e);
        }
    }
}