# tests/test_parser.py

from tree_sitter import Parser
from tree_sitter_language_pack import get_language

code = b"""
from auth.jwt import JWTManager

class AuthService:

    def login(self):
        pass

    def logout(self):
        pass
"""

parser = Parser()

parser.language = get_language("python")

tree = parser.parse(code)

root = tree.root_node

for subchild in child.children:

    if subchild.type == "block":

        for block_child in subchild.children:

            if block_child.type == "function_definition":

                for fn_child in block_child.children:

                    if fn_child.type == "identifier":

                        print(
                            "FUNCTION:",
                            fn_child.text.decode()
                        )