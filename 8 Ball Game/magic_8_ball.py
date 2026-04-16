import random
from info import displayInfo

displayInfo("Week 2 - Assignment #3")

responses = []

# FIXED PATH (this matches your folder from the screenshot)
with open("8 Ball Game/8_ball.txt", "r") as file:
    for line in file:
        responses.append(line.strip())

while True:
    question = input("Ask the Magic 8 Ball a question (or type quit): ")

    if question.lower() == "quit":
        print("Goodbye 👋")
        break

    answer = random.choice(responses)
    print("Magic 8 Ball says:", answer)
    print()

