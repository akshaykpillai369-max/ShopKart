import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("PEXELS_API_KEY")

headers = {
    "Authorization": api_key
}

params = {
    "query": "Acer Aspire 5 laptop white background",
    "per_page": 5,
    "color": "white",
}

response = requests.get(
    "https://api.pexels.com/v1/search",
    headers=headers,
    params=params
)

print("Status:", response.status_code)

data = response.json()

for photo in data.get("photos", []):
    print(photo["id"], photo["alt"], photo["src"]["original"])