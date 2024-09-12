from fastapi import FastAPI, HTTPException
from faker import Faker
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
fake = Faker()

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/api/generate-article")
async def generate_article():
    prompt = "Generate a random article with a title, body, and conclusion."
    response = openai.Completion.create(
        engine="gpt-4o-mini",
        prompt=prompt,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.5,
    )
    
    article = response.choices[0].text.strip()      
    return {"article": article}