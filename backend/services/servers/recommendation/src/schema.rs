use serde::Deserialize;

#[derive(Deserialize, Debug, Default)]
pub struct ReviewFilterOptions {
    pub university_name: Option<String>,
}


