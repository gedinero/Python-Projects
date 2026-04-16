import tkinter as tk
from tkinter import messagebox
import random

NFL_TEAMS = [
    "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
    "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
    "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
    "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
    "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
    "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
    "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
    "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
]

class MaddenTeamRandomizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Madden Franchise Team Randomizer")
        self.root.geometry("1100x650")

        self.players = []
        self.draft_order = []
        self.available_teams = NFL_TEAMS.copy()
        self.user_picks = {}
        self.current_pick_index = 0

        self.build_ui()

    def build_ui(self):
        title = tk.Label(
            self.root,
            text="Madden Franchise Team Randomizer",
            font=("Arial", 20, "bold")
        )
        title.pack(pady=10)

        # Top controls
        top_frame = tk.Frame(self.root)
        top_frame.pack(pady=10)

        self.name_entry = tk.Entry(top_frame, width=25, font=("Arial", 12))
        self.name_entry.grid(row=0, column=0, padx=5)

        add_btn = tk.Button(top_frame, text="Add Player", width=15, command=self.add_player)
        add_btn.grid(row=0, column=1, padx=5)

        remove_btn = tk.Button(top_frame, text="Remove Player", width=15, command=self.remove_player)
        remove_btn.grid(row=0, column=2, padx=5)

        randomize_btn = tk.Button(top_frame, text="Randomize Order", width=15, command=self.randomize_order)
        randomize_btn.grid(row=0, column=3, padx=5)

        reset_btn = tk.Button(top_frame, text="Reset Draft", width=15, command=self.reset_draft)
        reset_btn.grid(row=0, column=4, padx=5)

        # Main display area
        main_frame = tk.Frame(self.root)
        main_frame.pack(fill="both", expand=True, padx=10, pady=10)

        # Players list
        players_frame = tk.Frame(main_frame)
        players_frame.pack(side="left", fill="both", expand=True, padx=10)

        tk.Label(players_frame, text="Players", font=("Arial", 14, "bold")).pack()
        self.players_listbox = tk.Listbox(players_frame, font=("Arial", 12), height=20)
        self.players_listbox.pack(fill="both", expand=True)

        # Draft order
        order_frame = tk.Frame(main_frame)
        order_frame.pack(side="left", fill="both", expand=True, padx=10)

        tk.Label(order_frame, text="Draft Order", font=("Arial", 14, "bold")).pack()
        self.order_listbox = tk.Listbox(order_frame, font=("Arial", 12), height=20)
        self.order_listbox.pack(fill="both", expand=True)

        # User teams
        picks_frame = tk.Frame(main_frame)
        picks_frame.pack(side="left", fill="both", expand=True, padx=10)

        tk.Label(picks_frame, text="User Teams", font=("Arial", 14, "bold")).pack()
        self.picks_listbox = tk.Listbox(picks_frame, font=("Arial", 12), height=20)
        self.picks_listbox.pack(fill="both", expand=True)

        # CPU teams
        cpu_frame = tk.Frame(main_frame)
        cpu_frame.pack(side="left", fill="both", expand=True, padx=10)

        tk.Label(cpu_frame, text="CPU Teams", font=("Arial", 14, "bold")).pack()
        self.cpu_listbox = tk.Listbox(cpu_frame, font=("Arial", 12), height=20)
        self.cpu_listbox.pack(fill="both", expand=True)

        # Bottom controls
        bottom_frame = tk.Frame(self.root)
        bottom_frame.pack(pady=15)

        self.current_picker_label = tk.Label(
            bottom_frame,
            text="Current Pick: None",
            font=("Arial", 14, "bold")
        )
        self.current_picker_label.grid(row=0, column=0, padx=10)

        self.team_var = tk.StringVar()
        self.team_var.set("Select a Team")

        self.team_menu = tk.OptionMenu(bottom_frame, self.team_var, *self.available_teams)
        self.team_menu.config(width=25)
        self.team_menu.grid(row=0, column=1, padx=10)

        assign_btn = tk.Button(bottom_frame, text="Assign Team", width=15, command=self.assign_team)
        assign_btn.grid(row=0, column=2, padx=10)

    def add_player(self):
        name = self.name_entry.get().strip()

        if not name:
            messagebox.showwarning("Missing Name", "Please enter a player name.")
            return

        if name in self.players:
            messagebox.showwarning("Duplicate Name", "That player is already added.")
            return

        self.players.append(name)
        self.players_listbox.insert(tk.END, name)
        self.name_entry.delete(0, tk.END)

    def remove_player(self):
        selected = self.players_listbox.curselection()

        if not selected:
            messagebox.showwarning("No Selection", "Select a player to remove.")
            return

        index = selected[0]
        name = self.players_listbox.get(index)

        self.players_listbox.delete(index)
        self.players.remove(name)

    def randomize_order(self):
        if len(self.players) < 2:
            messagebox.showwarning("Not Enough Players", "Add at least 2 players.")
            return

        self.draft_order = self.players.copy()
        random.shuffle(self.draft_order)

        self.order_listbox.delete(0, tk.END)
        for i, player in enumerate(self.draft_order, start=1):
            self.order_listbox.insert(tk.END, f"Pick {i}: {player}")

        self.user_picks = {}
        self.current_pick_index = 0
        self.available_teams = NFL_TEAMS.copy()

        self.picks_listbox.delete(0, tk.END)
        self.cpu_listbox.delete(0, tk.END)

        self.update_team_menu()
        self.update_current_picker()

    def assign_team(self):
        if not self.draft_order:
            messagebox.showwarning("No Draft Order", "Randomize the player order first.")
            return

        if self.current_pick_index >= len(self.draft_order):
            messagebox.showinfo("Draft Complete", "All users already picked.")
            return

        selected_team = self.team_var.get()

        if selected_team == "Select a Team":
            messagebox.showwarning("No Team Selected", "Please select a team.")
            return

        current_player = self.draft_order[self.current_pick_index]
        self.user_picks[current_player] = selected_team

        self.picks_listbox.insert(
            tk.END,
            f"{self.current_pick_index + 1}. {current_player} → {selected_team}"
        )

        self.available_teams.remove(selected_team)
        self.current_pick_index += 1

        self.update_team_menu()
        self.update_current_picker()
        self.update_cpu_teams()

        if self.current_pick_index >= len(self.draft_order):
            messagebox.showinfo("Draft Complete", "All players have picked. Remaining teams are CPU-controlled.")

    def update_current_picker(self):
        if self.current_pick_index < len(self.draft_order):
            current_player = self.draft_order[self.current_pick_index]
            self.current_picker_label.config(text=f"Current Pick: {current_player}")
        else:
            self.current_picker_label.config(text="Current Pick: Draft Complete")

    def update_team_menu(self):
        menu = self.team_menu["menu"]
        menu.delete(0, "end")

        if self.available_teams:
            for team in self.available_teams:
                menu.add_command(label=team, command=lambda value=team: self.team_var.set(value))
            self.team_var.set(self.available_teams[0])
        else:
            self.team_var.set("No Teams Left")

    def update_cpu_teams(self):
        self.cpu_listbox.delete(0, tk.END)
        for team in self.available_teams:
            self.cpu_listbox.insert(tk.END, team)

    def reset_draft(self):
        self.players = []
        self.draft_order = []
        self.available_teams = NFL_TEAMS.copy()
        self.user_picks = {}
        self.current_pick_index = 0

        self.players_listbox.delete(0, tk.END)
        self.order_listbox.delete(0, tk.END)
        self.picks_listbox.delete(0, tk.END)
        self.cpu_listbox.delete(0, tk.END)

        self.team_var.set("Select a Team")
        self.update_team_menu()
        self.current_picker_label.config(text="Current Pick: None")

if __name__ == "__main__":
    root = tk.Tk()
    app = MaddenTeamRandomizer(root)
    root.mainloop()