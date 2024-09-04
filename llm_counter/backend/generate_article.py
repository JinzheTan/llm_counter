from fastapi import FastAPI, HTTPException
from faker import Faker
import openai

app = FastAPI()
fake = Faker()

openai.api_key = "sk-proj-2rGTMnnu3fox2DBQiPd9T3BlbkFJuR0aNaYB7XHzAWxVHSDO"

@app.post("/api/generate-article")
async def generate_article():
    prompt = "Generate a random article with a title, body, and conclusion."
    response = openai.Completion.create(
        engine="gpt-4o",
        prompt=prompt,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.5,
    )
    
    article = response.choices[0].text.strip()      
    return {"article": article}