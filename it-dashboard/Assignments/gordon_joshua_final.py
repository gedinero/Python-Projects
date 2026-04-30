# Final Project - Budget Tracker GUI
# Author: Joshua Gordon
# Date: 2026
# Description: A modern GUI-based budget tracker with reports.

import tkinter as tk
from tkinter import messagebox

transactions = []


def add_transaction(transaction_type):
    name = name_entry.get().strip()
    amount_text = amount_entry.get().strip()

    if name == "":
        messagebox.showerror("Input Error", "Name/category cannot be empty.")
        return

    try:
        amount = float(amount_text)

        if amount <= 0:
            messagebox.showerror("Input Error", "Amount must be greater than 0.")
            return

        transactions.append({
            "type": transaction_type,
            "name": name,
            "amount": amount
        })

        transaction_list.insert(
            tk.END,
            f"{transaction_type}  |  {name}  |  ${amount:.2f}"
        )

        name_entry.delete(0, tk.END)
        amount_entry.delete(0, tk.END)

        calculate_balance()

    except ValueError:
        messagebox.showerror("Input Error", "Please enter a valid number.")


def get_totals():
    income_total = 0
    expense_total = 0

    for transaction in transactions:
        if transaction["type"] == "Income":
            income_total += transaction["amount"]
        elif transaction["type"] == "Expense":
            expense_total += transaction["amount"]

    balance = income_total - expense_total
    return income_total, expense_total, balance


def calculate_balance():
    income_total, expense_total, balance = get_totals()

    income_value.config(text=f"${income_total:.2f}")
    expense_value.config(text=f"${expense_total:.2f}")
    balance_value.config(text=f"${balance:.2f}")


def generate_report():
    if not transactions:
        messagebox.showinfo("Budget Report", "No transactions available yet.")
        return

    income_total, expense_total, balance = get_totals()

    report = "BUDGET REPORT\n"
    report += "====================\n\n"
    report += f"Total Income:   ${income_total:.2f}\n"
    report += f"Total Expenses: ${expense_total:.2f}\n"
    report += f"Balance:        ${balance:.2f}\n\n"
    report += "Transactions:\n"

    for number, transaction in enumerate(transactions, start=1):
        report += (
            f"{number}. {transaction['type']} - "
            f"{transaction['name']}: ${transaction['amount']:.2f}\n"
        )

    messagebox.showinfo("Budget Report", report)


def clear_transactions():
    transactions.clear()
    transaction_list.delete(0, tk.END)
    income_value.config(text="$0.00")
    expense_value.config(text="$0.00")
    balance_value.config(text="$0.00")


root = tk.Tk()
root.title("Budget Tracker")
root.geometry("600x720")
root.resizable(False, False)
root.configure(bg="#11101A")


BG = "#11101A"
CARD = "#1D1B2F"
CARD_LIGHT = "#292642"
ORANGE = "#FF9F1C"
GREEN = "#2ECC71"
PURPLE = "#9B5DE5"
TEXT = "#F8F7FF"
MUTED = "#B8B5C9"
DARK = "#0B0A12"


header_frame = tk.Frame(root, bg=BG)
header_frame.pack(pady=20)

title_label = tk.Label(
    header_frame,
    text="Budget Tracker",
    font=("Arial", 28, "bold"),
    bg=BG,
    fg=TEXT
)
title_label.pack()

subtitle_label = tk.Label(
    header_frame,
    text="Track your money. Control your future.",
    font=("Arial", 11),
    bg=BG,
    fg=MUTED
)
subtitle_label.pack(pady=5)


main_card = tk.Frame(
    root,
    bg=CARD,
    highlightbackground=PURPLE,
    highlightthickness=2
)
main_card.pack(padx=30, pady=10, fill="x")

input_title = tk.Label(
    main_card,
    text="Add Transaction",
    font=("Arial", 16, "bold"),
    bg=CARD,
    fg=ORANGE
)
input_title.pack(pady=(20, 10))

name_label = tk.Label(
    main_card,
    text="Source / Category",
    font=("Arial", 10, "bold"),
    bg=CARD,
    fg=MUTED
)
name_label.pack(anchor="w", padx=40)

name_entry = tk.Entry(
    main_card,
    width=38,
    font=("Arial", 12),
    bg=CARD_LIGHT,
    fg=TEXT,
    insertbackground=TEXT,
    relief="flat"
)
name_entry.pack(pady=(5, 15), ipady=8)

amount_label = tk.Label(
    main_card,
    text="Amount",
    font=("Arial", 10, "bold"),
    bg=CARD,
    fg=MUTED
)
amount_label.pack(anchor="w", padx=40)

amount_entry = tk.Entry(
    main_card,
    width=38,
    font=("Arial", 12),
    bg=CARD_LIGHT,
    fg=TEXT,
    insertbackground=TEXT,
    relief="flat"
)
amount_entry.pack(pady=(5, 20), ipady=8)


button_frame = tk.Frame(main_card, bg=CARD)
button_frame.pack(pady=5)

income_button = tk.Button(
    button_frame,
    text="Add Income",
    width=16,
    bg=GREEN,
    fg=DARK,
    font=("Arial", 10, "bold"),
    relief="flat",
    command=lambda: add_transaction("Income")
)
income_button.grid(row=0, column=0, padx=8, pady=5, ipady=6)

expense_button = tk.Button(
    button_frame,
    text="Add Expense",
    width=16,
    bg=ORANGE,
    fg=DARK,
    font=("Arial", 10, "bold"),
    relief="flat",
    command=lambda: add_transaction("Expense")
)
expense_button.grid(row=0, column=1, padx=8, pady=5, ipady=6)

report_button = tk.Button(
    button_frame,
    text="Generate Report",
    width=16,
    bg=PURPLE,
    fg=TEXT,
    font=("Arial", 10, "bold"),
    relief="flat",
    command=generate_report
)
report_button.grid(row=1, column=0, padx=8, pady=5, ipady=6)

clear_button = tk.Button(
    button_frame,
    text="Clear All",
    width=16,
    bg=CARD_LIGHT,
    fg=TEXT,
    font=("Arial", 10, "bold"),
    relief="flat",
    command=clear_transactions
)
clear_button.grid(row=1, column=1, padx=8, pady=5, ipady=6)


summary_frame = tk.Frame(root, bg=BG)
summary_frame.pack(pady=15)


def create_summary_card(parent, title, value, color):
    card = tk.Frame(
        parent,
        bg=CARD,
        width=165,
        height=85,
        highlightbackground=color,
        highlightthickness=2
    )
    card.pack_propagate(False)

    tk.Label(
        card,
        text=title,
        font=("Arial", 10, "bold"),
        bg=CARD,
        fg=MUTED
    ).pack(pady=(12, 3))

    value_label = tk.Label(
        card,
        text=value,
        font=("Arial", 16, "bold"),
        bg=CARD,
        fg=color
    )
    value_label.pack()

    return card, value_label


income_card, income_value = create_summary_card(summary_frame, "Income", "$0.00", GREEN)
income_card.grid(row=0, column=0, padx=8)

expense_card, expense_value = create_summary_card(summary_frame, "Expenses", "$0.00", ORANGE)
expense_card.grid(row=0, column=1, padx=8)

balance_card, balance_value = create_summary_card(summary_frame, "Balance", "$0.00", PURPLE)
balance_card.grid(row=0, column=2, padx=8)


list_card = tk.Frame(
    root,
    bg=CARD,
    highlightbackground=GREEN,
    highlightthickness=2
)
list_card.pack(padx=30, pady=10, fill="x")

transaction_label = tk.Label(
    list_card,
    text="Transaction History",
    font=("Arial", 15, "bold"),
    bg=CARD,
    fg=TEXT
)
transaction_label.pack(pady=(15, 8))

transaction_list = tk.Listbox(
    list_card,
    width=58,
    height=6,
    bg=CARD_LIGHT,
    fg=TEXT,
    selectbackground=PURPLE,
    selectforeground=TEXT,
    font=("Arial", 10),
    relief="flat",
    borderwidth=0
)
transaction_list.pack(padx=20, pady=(0, 15), ipady=5)


exit_button = tk.Button(
    root,
    text="Exit",
    width=18,
    bg=ORANGE,
    fg=DARK,
    font=("Arial", 10, "bold"),
    relief="flat",
    command=root.destroy
)
exit_button.pack(pady=10, ipady=6)


root.mainloop()