use std::sync::Arc;

use axum::{
    routing::get,
    Router
};

use crate::{
    handler::{health_check, get_recommendation_score, get_recommendation_score_all, serve_swagger},
    AppState
};

pub fn create_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/healthcheck", get(health_check))
        .route("/api/recommendation", get(get_recommendation_score))
        .route("/api/recommendation_all", get(get_recommendation_score_all))
        .route("/recommendation_swagger.json", get(serve_swagger))
        .with_state(app_state)
}