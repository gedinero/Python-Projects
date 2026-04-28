# Final Project - Budget Tracker
# Author: Joshua Gordon
# Date: 2026
# Description: A menu-based budget tracker that lets users add income, add expenses,
# view transactions, and calculate the current balance.

transactions = []


def add_income():
    """Add an income transaction to the budget tracker."""
    source = input("Enter income source: ").strip()

    if source == "":
        print("Income source cannot be empty.")
        return

    try:
        amount = float(input("Enter income amount: "))

        if amount <= 0:
            print("Amount must be greater than 0.")
            return

        transactions.append({"type": "Income", "name": source, "amount": amount})
        print("Income added successfully.")

    except ValueError:
        print("Please enter a valid number for the amount.")


def add_expense():
    """Add an expense transaction to the budget tracker."""
    category = input("Enter expense category: ").strip()

    if category == "":
        print("Expense category cannot be empty.")
        return

    try:
        amount = float(input("Enter expense amount: "))

        if amount <= 0:
            print("Amount must be greater than 0.")
            return

        transactions.append({"type": "Expense", "name": category, "amount": amount})
        print("Expense added successfully.")

    except ValueError:
        print("Please enter a valid number for the amount.")


def view_transactions():
    """Display all income and expense transactions."""
    if not transactions:
        print("No transactions found.")
        return

    print("\n--- Transactions ---")
    for number, transaction in enumerate(transactions, start=1):
        print(
            f"{number}. {transaction['type']} - "
            f"{transaction['name']}: ${transaction['amount']:.2f}"
        )


def calculate_balance():
    """Calculate and display the current budget balance."""
    income_total = 0
    expense_total = 0

    for transaction in transactions:
        if transaction["type"] == "Income":
            income_total += transaction["amount"]
        elif transaction["type"] == "Expense":
            expense_total += transaction["amount"]

    balance = income_total - expense_total

    print("\n--- Budget Summary ---")
    print(f"Total Income:   ${income_total:.2f}")
    print(f"Total Expenses: ${expense_total:.2f}")
    print(f"Balance:        ${balance:.2f}")


def main():
    """Run the main menu loop for the budget tracker."""
    while True:
        print("\n=== Budget Tracker ===")
        print("1. Add Income")
        print("2. Add Expense")
        print("3. View Transactions")
        print("4. Calculate Balance")
        print("5. Exit")

        choice = input("Choose an option: ").strip()

        if choice == "1":
            add_income()
        elif choice == "2":
            add_expense()
        elif choice == "3":
            view_transactions()
        elif choice == "4":
            calculate_balance()
        elif choice == "5":
            print("Goodbye.")
            break
        else:
            print("Invalid option. Please choose 1 through 5.")


if __name__ == "__main__":
    main()