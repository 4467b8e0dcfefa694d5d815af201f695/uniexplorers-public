import pandas as pd
import json
# from nltk.corpus import words
import nltk

# nltk.download("words")

# IN_FILE: str = "tags/university_tags_mapping.csv"
# ENGLISH_WORDS_SET = set(nltk.corpus.words.words())


# with open(IN_FILE) as f:
#     df = pd.read_csv(IN_FILE)

# valid_tags_df = df[df["tag_name"].apply(lambda word: word in ENGLISH_WORDS_SET)]
# unique_tags = valid_tags_df["tag_name"].unique()

# out = []
# for unique_tag in unique_tags:
#     out.append({
#         "name": unique_tag
#     })


# with open("tags/out_tags.json", "w") as outf:
#     json.dump(out, outf)

# with open("tags/out_uni_tags.json", "w") as outf:
#     json.dump(valid_tags_df.to_dict(orient="records"), outf)

# print(valid_tags_df.to_dict(orient="records"))

df = pd.read_json("tags/out_uni_tags.json")

print(df.to_sql())