from backend.router.question_router import QuestionRouter

router = QuestionRouter()

questions = [
    "Which React components exist?",
    "Explain the architecture of this repository",
    "Compare Create and Edit components"
]

for q in questions:

    print(q)

    print(
        router.route(q)
    )

    print()