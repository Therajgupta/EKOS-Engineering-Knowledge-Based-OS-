from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()


class LLMManager:

    SYSTEM_PROMPT = (
        "You are EKOS, an expert AI assistant specialized in understanding codebases. "
        "You answer questions by reasoning over real repository code provided as context. "
        "Always cite specific file paths and line numbers when referencing code. "
        "Be concise, accurate, and technical. "
        "If the context doesn't contain enough information to answer, say so clearly."
    )

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Copy .env.example to .env and add your key "
                "from https://console.groq.com"
            )
        self.client = Groq(api_key=api_key)

    def ask_small(self, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user",   "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=1024,
        )
        return response.choices[0].message.content

    def ask_large(self, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user",   "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=2048,
        )
        return response.choices[0].message.content
