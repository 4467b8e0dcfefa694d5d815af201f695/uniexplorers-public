import json
import pandas as pd
from typing import Dict, Any
from pathlib import Path

JSON_PATH: Path = Path("json/")
OUT_PATH: Path = Path("out/")


def flatten_json_array(json_array):
    flattened = []
    for key, value in json_array.items():
        # Add the key to the value dictionary
        if value:
            value['key'] = key
            flattened.append(value)
    return flattened


for file in JSON_PATH.glob("*.json"):
    with open(file) as in_f:
        data: Dict[str, Any] = json.load(in_f)
        # first_key: str = list(data.keys())[0]

        with open(OUT_PATH / file.name, "w") as outf:
            json.dump(flatten_json_array(data), outf)
            
        # print("\n\n\n")

        