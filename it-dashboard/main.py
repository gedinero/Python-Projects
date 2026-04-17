"""
IT Dashboard - COP1034C Python for IT
Joshua Gordon | 04/14/26

Week 2 Project: Server Log Analyzer
"""

# Name: Joshua Gordon
# Course: COP1034C Python for IT
# Project: Week 2 Server Log Analyzer

import os

# Initialize data structures
severity_counts = {}
unique_errors = set()
critical_events = []
log_entries = []

total_lines = 0
error_count = 0

# 🔥 THIS FIXES ALL PATH ISSUES
base_dir = os.path.dirname(__file__)
log_path = os.path.join(base_dir, "Data", "server.log")

try:
    with open(log_path, "r") as file:
        for line in file:
            total_lines += 1
            line = line.strip()

            parts = line.split(maxsplit=3)

            if len(parts) < 4:
                continue

            date = line[:10]
            time = parts[1]
            severity = parts[2]
            message = parts[3]

            entry = {
                "date": date,
                "time": time,
                "severity": severity,
                "message": message
            }

            log_entries.append(entry)

            severity_counts[severity] = severity_counts.get(severity, 0) + 1

            if severity == "ERROR":
                error_count += 1
                unique_errors.add(message)

            if severity == "CRITICAL":
                critical_events.append(message)

except FileNotFoundError:
    print("Error: server.log file not found.")
    exit(1)

# Calculate error rate
if total_lines > 0:
    error_rate = (error_count / total_lines) * 100
else:
    error_rate = 0

# Print report
print("\n==============================")
print(" SERVER LOG ANALYSIS REPORT ")
print("==============================\n")

print(f"Log File   : {log_path}")
print(f"Lines Read : {total_lines}\n")

print(f"INFO     : {severity_counts.get('INFO', 0)}")
print(f"WARNING  : {severity_counts.get('WARNING', 0)}")
print(f"ERROR    : {severity_counts.get('ERROR', 0)}")
print(f"CRITICAL : {severity_counts.get('CRITICAL', 0)}\n")

print(f"Error Rate : {error_rate:.2f}%\n")

print("Unique Errors:")
for err in unique_errors:
    print(f"- {err}")

print("\nCritical Events:")
for event in critical_events:
    print(f"- {event}")

# Save to file
output_path = os.path.join(base_dir, "log_summary.txt")

with open(output_path, "w") as out:
    out.write("SERVER LOG ANALYSIS REPORT\n\n")
    out.write(f"Lines Read: {total_lines}\n")
    out.write(f"Error Rate: {error_rate:.2f}%\n\n")

    out.write("Severity Counts:\n")
    for key, value in severity_counts.items():
        out.write(f"{key}: {value}\n")

    out.write("\nUnique Errors:\n")
    for err in unique_errors:
        out.write(f"- {err}\n")

    out.write("\nCritical Events:\n")
    for event in critical_events:
        out.write(f"- {event}\n")