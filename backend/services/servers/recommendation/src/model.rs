use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Deserialize, Serialize)]
pub struct MinimalReviewModel {
    pub university_name: Option<String>,
    pub created: Option<chrono::DateTime<chrono::Utc>>,
    pub updated: Option<chrono::DateTime<chrono::Utc>>,
    pub rating: f32
}

#[derive(Debug, Deserialize, Serialize, ToSchema)]
pub struct Recommendation {
    #[schema(example = "Singapore Management University")]
    pub name: String,
    #[schema(example = "true")]
    pub success: bool,
    #[schema(example = "0.5")]
    pub rating: f32,
}

#[derive(Debug, Deserialize, Serialize, ToSchema)]
pub struct RecommendationWithFreshness {
    #[schema(example = "true")]
    pub success: bool,
    #[schema(example = "true")]
    pub fresh: bool,
    #[schema(example = "0.5")]
    pub rating: f32
}

#[derive(Debug, Deserialize, Serialize, ToSchema)]
pub struct RecommendationError {
    #[schema(example = "false")]
    pub success: bool,
    #[schema(example = "magic error")]
    pub message: String
}