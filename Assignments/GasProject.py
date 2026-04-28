import tkinter as tk
from tkinter import messagebox


def calculate_mpg():
    """Calculate miles per gallon."""
    try:
        gallons = float(gallons_entry.get())
        miles = float(miles_entry.get())

        if gallons <= 0:
            messagebox.showerror("Error", "Gallons must be greater than 0.")
            return

        mpg = miles / gallons
        result_label.config(text=f"Miles Per Gallon = {mpg:.2f}")

    except ValueError:
        messagebox.showerror("Error", "Please enter valid numbers.")


def quit_app():
    """Close the program."""
    window.destroy()


window = tk.Tk()
window.title("MPG Calculator")
window.geometry("560x430")
window.configure(bg="#101820")
window.resizable(False, False)

title_label = tk.Label(
    window,
    text="Gas Mileage Calculator",
    font=("Arial", 24, "bold"),
    bg="#101820",
    fg="#00f5d4"
)
title_label.pack(pady=(30, 5))

subtitle_label = tk.Label(
    window,
    text="Calculate your car's miles per gallon",
    font=("Arial", 12),
    bg="#101820",
    fg="white"
)
subtitle_label.pack(pady=(0, 25))

card = tk.Frame(
    window,
    bg="#1b263b",
    padx=30,
    pady=25
)
card.pack(pady=5)

gallons_label = tk.Label(
    card,
    text="Gallons of Gas:",
    font=("Arial", 13, "bold"),
    bg="#1b263b",
    fg="white"
)
gallons_label.grid(row=0, column=0, sticky="w", pady=12)

gallons_entry = tk.Entry(
    card,
    font=("Arial", 13),
    width=18,
    justify="center"
)
gallons_entry.grid(row=0, column=1, padx=20, pady=12)

miles_label = tk.Label(
    card,
    text="Miles Driven:",
    font=("Arial", 13, "bold"),
    bg="#1b263b",
    fg="white"
)
miles_label.grid(row=1, column=0, sticky="w", pady=12)

miles_entry = tk.Entry(
    card,
    font=("Arial", 13),
    width=18,
    justify="center"
)
miles_entry.grid(row=1, column=1, padx=20, pady=12)

result_label = tk.Label(
    window,
    text="Miles Per Gallon = ",
    font=("Arial", 18, "bold"),
    bg="#101820",
    fg="#ffd166"
)
result_label.pack(pady=25)

button_frame = tk.Frame(window, bg="#101820")
button_frame.pack(pady=5)

calculate_button = tk.Button(
    button_frame,
    text="Calculate MPG",
    font=("Arial", 12, "bold"),
    bg="#00f5d4",
    fg="#101820",
    width=15,
    height=2,
    command=calculate_mpg
)
calculate_button.grid(row=0, column=0, padx=12)

quit_button = tk.Button(
    button_frame,
    text="Quit",
    font=("Arial", 12, "bold"),
    bg="#ef476f",
    fg="white",
    width=10,
    height=2,
    command=quit_app
)
quit_button.grid(row=0, column=1, padx=12)

window.mainloop()