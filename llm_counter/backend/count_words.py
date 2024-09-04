# llm_counter/backend/count_words.py
from fastapi import FastAPI
from pydantic import BaseModel
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = FastAPI()

nltk.download('punkt')
nltk.download('stopwords')

class TextInput(BaseModel):
    text: str

@app.post("/api/count-words")
async def count_words(input: TextInput):
    words = word_tokenize(input.text.lower())
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.isalpha() and word not in stop_words]
    word_counts = Counter(words)
    top_words = word_counts.most_common(10)
    return {"topWords": [{"word": word, "count": count} for word, count in top_words]}