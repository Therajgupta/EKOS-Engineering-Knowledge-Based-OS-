class QuestionRouter:
    """
    Routes questions to the appropriate LLM size based on complexity.

    Simple (factual lookups) → small model (llama-3.1-8b-instant)
    Complex (reasoning, explanation, analysis) → large model (llama-3.3-70b-versatile)
    """

    COMPLEX_KEYWORDS = {
        "why", "explain", "compare", "analyze", "analyse",
        "architecture", "design", "optimize", "optimise",
        "refactor", "flow", "how does", "how do",
        "understand", "describe", "summarize", "summarise",
        "trace", "debug", "investigate", "relationship",
        "difference", "suggest", "improve", "review",
        "security", "performance", "pattern",
    }

    def route(self, question: str) -> str:
        q = question.lower()
        for keyword in self.COMPLEX_KEYWORDS:
            if keyword in q:
                return "large"
        return "small"
