from backend.llm.llm_manager import LLMManager

llm = LLMManager()

response = llm.ask_small(
    "how much tokens can i use in a day with groq free tier?"
)

print(response)