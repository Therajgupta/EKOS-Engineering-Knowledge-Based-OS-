class ContextBuilder:

    def build(self, results) -> str:
        """
        Build a rich context string from Qdrant search results.
        Groups by file and includes similarity scores.
        """
        if not results.points:
            return "No relevant code found in the repository."

        context_parts = []
        seen: set[str] = set()

        for point in results.points:
            payload = point.payload
            content = payload.get("content", "").strip()
            key = f"{payload.get('file_path')}:{payload.get('symbol_name')}"

            # deduplicate identical chunks
            if key in seen or not content:
                continue
            seen.add(key)

            score = getattr(point, "score", None)
            score_str = f" (relevance: {score:.2f})" if score is not None else ""

            context_parts.append(
                f"### {payload.get('chunk_type', 'code').upper()}: "
                f"{payload.get('symbol_name', 'unknown')}{score_str}\n"
                f"File: {payload.get('file_path', 'unknown')}\n"
                f"Language: {payload.get('language', 'unknown')}\n"
                f"Lines: {payload.get('start_line', '?')}–{payload.get('end_line', '?')}\n"
                f"```\n{content}\n```"
            )

        return "\n\n".join(context_parts) if context_parts else "No relevant code found."
