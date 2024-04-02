1. Parallelize computation of sim score across user_tag
2. Implement caching in Redis for results
3. Implement intelligent re-calculation (hash user tags, compare to previously stored version, calculate and overwrite if updated)