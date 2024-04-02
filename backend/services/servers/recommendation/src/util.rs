use std::collections::HashMap;
use chrono::{DateTime, Utc, Duration};
use std::sync::Mutex;
use std::f32::consts::E;

use crate::model::MinimalReviewModel;

pub struct CacheItem {
    rating: f32,
    last_updated: DateTime<Utc>
}

pub struct RatingCache {
    ratings: Mutex<HashMap<String, CacheItem>>,
    lambda: f32
}

impl RatingCache {
    pub fn new(lambda: f32) -> Self {
        RatingCache {
            ratings: Mutex::new(HashMap::new()),
            lambda
        }
    }

    pub fn get_rating(&self, university_name: &str, reviews: &[MinimalReviewModel]) -> f32 {
        let now = Utc::now();
        let mut ratings = self.ratings.lock().unwrap();

        match ratings.get(university_name) {
            Some(cache_item) if (now - cache_item.last_updated) < Option::expect(Duration::try_minutes(15), "THE WORLD IS ENDING") => { // 15min cache expiry
                cache_item.rating
            },
            _ => {
                let rating = get_updated_rating(reviews, self.lambda);
                ratings.insert(university_name.to_string(), CacheItem { rating, last_updated: now });
                rating
            }
        }
    }

    pub fn get_valid_rating(&self, university_name: &str) -> Option<f32> {
        let now = Utc::now();
        let ratings = self.ratings.lock().unwrap();

        ratings.get(university_name).and_then(|cache_item| {
            if (now - cache_item.last_updated) < Option::expect(Duration::try_minutes(15), "THE WORLD IS ENDING") {
                Some(cache_item.rating)
            } else {
                None
            }
        })
    }
}

pub fn get_updated_rating(reviews: &[MinimalReviewModel], lambda: f32) -> f32 {
    let now = Utc::now();

    let (
        mut weighted_pos_votes,
        mut weighted_neg_votes
    ) = (0f32, 0f32);


    for review in reviews {
        let review_time = review.updated.unwrap_or_else(
            || review.created.unwrap_or(now)
        );
        let days_since_review = (now - review_time).num_days() as f32;

        let decay_factor = E.powf(-lambda * days_since_review);

        if review.rating >= 2.5 {
            weighted_pos_votes += 1.0 * decay_factor;
        } else {
            weighted_neg_votes += 1.0 * decay_factor;
        }
    }

    let weighted_total_votes = weighted_neg_votes + weighted_pos_votes;
    let average = weighted_pos_votes / weighted_total_votes;
    let score = average - (average - 0.5) * 2f32.powf(-weighted_total_votes.log10() - 1.0);

    score * 100.0
}