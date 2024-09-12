# llm_counter/api/llm_counter.py
from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY")

class CountInput(BaseModel):
    text: str
    words: list[str]
    model: str

@app.post("/api/llm-count")
async def llm_count(input: CountInput):
    prompt = f"Count the occurrences of the following words in the given text. Only return the counts as a comma-separated list of numbers.\n\nWords: {', '.join(input.words)}\n\nText: {input.text}"
    
    response = openai.ChatCompletion.create(
        model=input.model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that counts word occurrences."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=50,
        n=1,
        temperature=0.0,
    )
    
    counts = [int(count.strip()) for count in response.choices[0].message['content'].split(',')]
    return {"counts": counts}