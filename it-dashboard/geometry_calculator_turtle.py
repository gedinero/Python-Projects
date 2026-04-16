import math
import turtle

t = turtle.Turtle()
t.speed(3)

def area_rectangle(l, w):
    return l * w

def perimeter_rectangle(l, w):
    return 2 * l + w

def area_circle(r):
    return math.pi * r ** 2

def circumference(r):
    return 2 * math.pi * r

def area_triangle(b, h):
    return 0.5 * b * h

def perimeter_triangle(a, b, c):
    return a + b + c

def draw_rectangle(t, l, w):
    for side in [l, w, l, w]:
        t.forward(side)
        t.right(90)

        import math
import turtle

t = turtle.Turtle()
t.speed(3)

def area_rectangle(l, w):
    return l * w

def perimeter_rectangle(l, w):
    return 2 * (l + w)

def area_circle(r):
    return math.pi * r ** 2

def circumference(r):
    return 2 * math.pi * r

def area_triangle(b, h):
    return 0.5 * b * h

def perimeter_triangle(a, b, c):
    return a + b + c

def draw_rectangle(t, l, w):
    for side in [l, w, l, w]:
        t.forward(side)
        t.right(90)

def draw_circle(t, r):
    t.circle(r)

def draw_triangle(t, side):
    for _ in range(3):
        t.forward(side)
        t.left(120)

while True:
    print("\nGeometry Calculator")
    print("1. Rectangle")
    print("2. Circle")
    print("3. Triangle")
    print("4. Quit")

    choice = input("Choose an option: ")

    if choice == "1":
        l = float(input("Enter length: "))
        w = float(input("Enter width: "))

        area = area_rectangle(l, w)
        perim = perimeter_rectangle(l, w)

        print(f"Area: {area:.2f}")
        print(f"Perimeter: {perim:.2f}")

        x = float(input("Enter x position: "))
        y = float(input("Enter y position: "))

        t.penup()
        t.goto(x, y)
        t.pendown()

        draw_rectangle(t, l, w)

    elif choice == "2":
        r = float(input("Enter radius: "))

        area = area_circle(r)
        circ = circumference(r)

        print(f"Area: {area:.2f}")
        print(f"Circumference: {circ:.2f}")

        x = float(input("Enter x position: "))
        y = float(input("Enter y position: "))

        t.penup()
        t.goto(x, y)
        t.pendown()

        draw_circle(t, r)

    elif choice == "3":
        side = float(input("Enter side length: "))

        height = side * 0.866

        area = area_triangle(side, height)
        perim = perimeter_triangle(side, side, side)

        print(f"Area: {area:.2f}")
        print(f"Perimeter: {perim:.2f}")

        x = float(input("Enter x position: "))
        y = float(input("Enter y position: "))

        t.penup()
        t.goto(x, y)
        t.pendown()

        draw_triangle(t, side)
    elif choice == "4":

        print("Goodbye 👋")
        break
