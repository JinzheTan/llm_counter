# llm_counter/api/crawl_article.py
from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup
import random

app = FastAPI()

@app.get("/api/crawl-article")
async def crawl_article():
    urls = [
        "https://en.wikipedia.org/wiki/Special:Random",
        "https://www.bbc.com/news",
        "https://www.nytimes.com/",
    ]
    url = random.choice(urls)
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    paragraphs = soup.find_all('p')
    article = ' '.join([p.text for p in paragraphs])
    return {"article": article[:1000]}  # Limit to approximately 1000 words