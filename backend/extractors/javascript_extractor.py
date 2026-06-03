from backend.models.knowledge_object import KnowledgeObject


class JavaScriptExtractor:
    """
    Extracts knowledge objects from JavaScript/TypeScript AST nodes.
    Covers: imports, exports, functions, arrow functions,
            React components, Express routes, classes.
    """

    def extract(self, root, content: str, file_path, repo_name: str = "unknown"):
        knowledge_objects = []

        for node in root.children:
            src = content[node.start_byte:node.end_byte]

            # ── IMPORT STATEMENTS ─────────────────────────────────────────
            if node.type == "import_statement":
                obj = KnowledgeObject(
                    repository=repo_name,
                    file_path=str(file_path),
                    chunk_type="import",
                    symbol_name=self._first_line(src),
                    content=src,
                    language="javascript",
                    start_line=node.start_point[0],
                    end_line=node.end_point[0],
                )
                knowledge_objects.append(obj)

            # ── LEXICAL DECLARATIONS (const / let) ────────────────────────
            elif node.type == "lexical_declaration":
                symbol_name = self._extract_variable_name(node, content)

                # require() imports
                if "require(" in src:
                    obj = KnowledgeObject(
                        repository=repo_name,
                        file_path=str(file_path),
                        chunk_type="import",
                        symbol_name=symbol_name,
                        content=src,
                        language="javascript",
                        start_line=node.start_point[0],
                        end_line=node.end_point[0],
                    )
                    knowledge_objects.append(obj)

                # Arrow-function components / helpers
                elif "=>" in src:
                    # Check if it looks like a React component
                    chunk_type = "component" if self._is_component(symbol_name, src) else "function"
                    obj = KnowledgeObject(
                        repository=repo_name,
                        file_path=str(file_path),
                        chunk_type=chunk_type,
                        symbol_name=symbol_name,
                        content=src[:500],
                        language="javascript",
                        start_line=node.start_point[0],
                        end_line=node.end_point[0],
                    )
                    knowledge_objects.append(obj)

                # Express route handlers stored in const
                elif self._is_express_route(src):
                    obj = KnowledgeObject(
                        repository=repo_name,
                        file_path=str(file_path),
                        chunk_type="route",
                        symbol_name=symbol_name,
                        content=src[:500],
                        language="javascript",
                        start_line=node.start_point[0],
                        end_line=node.end_point[0],
                    )
                    knowledge_objects.append(obj)

            # ── FUNCTION DECLARATIONS ─────────────────────────────────────
            elif node.type == "function_declaration":
                symbol_name = self._node_name(node, content)
                obj = KnowledgeObject(
                    repository=repo_name,
                    file_path=str(file_path),
                    chunk_type="function",
                    symbol_name=symbol_name,
                    content=src[:600],
                    language="javascript",
                    start_line=node.start_point[0],
                    end_line=node.end_point[0],
                )
                knowledge_objects.append(obj)

            # ── CLASS DECLARATIONS ────────────────────────────────────────
            elif node.type == "class_declaration":
                symbol_name = self._node_name(node, content)
                obj = KnowledgeObject(
                    repository=repo_name,
                    file_path=str(file_path),
                    chunk_type="class",
                    symbol_name=symbol_name,
                    content=src[:600],
                    language="javascript",
                    start_line=node.start_point[0],
                    end_line=node.end_point[0],
                )
                knowledge_objects.append(obj)

            # ── EXPORT STATEMENTS ─────────────────────────────────────────
            elif node.type == "export_statement":
                obj = KnowledgeObject(
                    repository=repo_name,
                    file_path=str(file_path),
                    chunk_type="export",
                    symbol_name=self._first_line(src),
                    content=src[:400],
                    language="javascript",
                    start_line=node.start_point[0],
                    end_line=node.end_point[0],
                )
                knowledge_objects.append(obj)

            # ── EXPRESSION STATEMENTS (router.get/post/put/delete) ────────
            elif node.type == "expression_statement":
                if self._is_express_route(src):
                    method, path_str = self._extract_route_info(src)
                    obj = KnowledgeObject(
                        repository=repo_name,
                        file_path=str(file_path),
                        chunk_type="route",
                        symbol_name=f"{method} {path_str}",
                        content=src[:600],
                        language="javascript",
                        start_line=node.start_point[0],
                        end_line=node.end_point[0],
                    )
                    knowledge_objects.append(obj)

        return knowledge_objects

    # ── helpers ──────────────────────────────────────────────────────────

    def _first_line(self, src: str) -> str:
        return src.split("\n")[0].strip()[:120]

    def _extract_variable_name(self, node, content: str) -> str:
        for child in node.children:
            if child.type == "variable_declarator":
                for grandchild in child.children:
                    if grandchild.type == "identifier":
                        return content[grandchild.start_byte:grandchild.end_byte]
        return "unknown"

    def _node_name(self, node, content: str) -> str:
        for child in node.children:
            if child.type == "identifier":
                return content[child.start_byte:child.end_byte]
        return "unknown"

    def _is_component(self, name: str, src: str) -> bool:
        """Heuristic: PascalCase name and returns JSX."""
        if name and name[0].isupper():
            return True
        return "return (" in src and ("<" in src or "jsx" in src.lower())

    def _is_express_route(self, src: str) -> bool:
        keywords = [
            "router.get(", "router.post(", "router.put(",
            "router.delete(", "router.patch(",
            "app.get(", "app.post(", "app.put(",
            "app.delete(", "app.patch(",
        ]
        return any(kw in src for kw in keywords)

    def _extract_route_info(self, src: str) -> tuple[str, str]:
        """Extract HTTP method and path from an Express route definition."""
        methods = ["get", "post", "put", "delete", "patch"]
        for m in methods:
            for prefix in ["router.", "app."]:
                token = f"{prefix}{m}("
                if token in src:
                    try:
                        after = src[src.index(token) + len(token):]
                        # grab the quoted string
                        for q in ['"', "'"]:
                            if after.startswith(q):
                                end = after.index(q, 1)
                                return m.upper(), after[1:end]
                        return m.upper(), after.split(",")[0].strip().strip("'\"")
                    except Exception:
                        return m.upper(), "unknown"
        return "UNKNOWN", "unknown"
