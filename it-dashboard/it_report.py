# -----------------------------------------
# Week 1 Project: IT System Report Generator
# -----------------------------------------

# Name: Jordan Gordon
# Course: Python for IT
# Week 1 Project: IT Dashboard

# Server information variables
server_name = "Not entered"
ip_address = "Not entered"
department = "Not entered"

# Disk storage variables
total_disk_gb = 0
used_disk_gb = 0

# Calculated disk usage percentage
usage_pct = 0.0

# Disk status message
disk_status = "Not calculated"

# Boolean flag to track whether report data is ready
report_ready = False

# Main menu loop
while True:
    print("\n--- IT Report Generator ---")
    print("1) Enter server info")
    print("2) View report")
    print("3) Exit")

    choice = input("Select an option: ")

    # Option 1: Enter server information
    if choice == "1":
        server_name = input("Enter server name: ")
        ip_address = input("Enter IP address: ")
        department = input("Enter department: ")

        total_disk_gb = int(input("Enter total disk space in GB: "))
        used_disk_gb = int(input("Enter used disk space in GB: "))

        # Edge case validation
        if total_disk_gb <= 0 or used_disk_gb < 0 or used_disk_gb > total_disk_gb:
            print("Error: Invalid disk values entered.")
            report_ready = False
            continue

        # Calculate disk usage percentage
        usage_pct = (used_disk_gb / total_disk_gb) * 100

        # Classify disk usage status
        if usage_pct > 90:
            disk_status = "CRITICAL - Immediate action required"
        elif usage_pct > 75:
            disk_status = "WARNING - Disk usage is elevated"
        else:
            disk_status = "OK - Disk usage is normal"

        report_ready = True
        print("Server data recorded successfully.")

    # Option 2: View report
    elif choice == "2":
        if not report_ready:
            print("No data entered yet. Choose option 1 first.")
        else:
            print("\n--- IT System Report ---")
            print(f"{'Server Name':<15}: {server_name}")
            print(f"{'IP Address':<15}: {ip_address}")
            print(f"{'Department':<15}: {department}")
            print(f"{'Usage %':<15}: {usage_pct:.2f}%")
            print(f"{'Status':<15}: {disk_status}")

            # System checks list using a for loop
            checks = ["Ping response", "DNS resolution", "Firewall rule active"]
            print("\nSystem Checks:")
            for check in checks:
                print(f"- {check}: PASS")

    # Option 3: Exit
    elif choice == "3":
        print("Goodbye.")
        break

    # Invalid menu choice
    else:
        print("Invalid choice. Enter 1, 2, or 3.")
