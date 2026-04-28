class Employee:
    def __init__(self, employee_id, fname, lname, department, jobtitle):
        self.employee_id = employee_id
        self.fname = fname
        self.lname = lname
        self.department = department
        self.jobtitle = jobtitle

    def __str__(self):
     return (
        f"\033[1;34mID:\033[0m {self.employee_id}\n"
        f"\033[1;32mName:\033[0m {self.fname} {self.lname}\n"
        f"\033[1;33mDepartment:\033[0m {self.department}\n"
        f"\033[1;35mJob Title:\033[0m {self.jobtitle}\n"
    )

    def getId(self):
        return self.employee_id

    def getFirstName(self):
        return self.fname

    def getLastName(self):
        return self.lname

    def setName(self, first, last):
        self.fname = first
        self.lname = last

    def getName(self):
        return f"{self.fname} {self.lname}"

    def getDepartment(self):
        return self.department

    def setDepartment(self, department):
        self.department = department

    def getJobTitle(self):
        return self.jobtitle

    def setJobTitle(self, title):
        self.jobtitle = title


def main():
    employee_list = []

    with open("employees.txt", "r") as file:
        lines = [line.strip() for line in file if line.strip()]

    for i in range(0, len(lines), 4):
        employee_id = lines[i]
        full_name = lines[i + 1]
        department = lines[i + 2]
        jobtitle = lines[i + 3]

        name_parts = full_name.split()
        fname = name_parts[0]
        lname = name_parts[1]

        employee = Employee(employee_id, fname, lname, department, jobtitle)
        employee_list.append(employee)

    for employee in employee_list:
        print(employee)
        print("-" * 30)

main()