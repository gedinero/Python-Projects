from colorama import init

init()

# Color codes
BLUE = "\033[1;34m"
GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
PURPLE = "\033[1;35m"
CYAN = "\033[1;36m"
RESET = "\033[0m"


class Employee:
    def __init__(self, employee_id, fname, lname, department, jobtitle):
        self.employee_id = employee_id
        self.fname = fname
        self.lname = lname
        self.department = department
        self.jobtitle = jobtitle

    def __str__(self):
        return (
            f"{BLUE}Employee ID:{RESET} {self.employee_id}\n"
            f"{GREEN}Name:{RESET} {self.getName()}\n"
            f"{YELLOW}Department:{RESET} {self.department}\n"
            f"{PURPLE}Job Title:{RESET} {self.jobtitle}\n"
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
        return f"{self.fname} {self.lname}".strip()

    def getDepartment(self):
        return self.department

    def setDepartment(self, department):
        self.department = department

    def getJobTitle(self):
        return self.jobtitle

    def setJobTitle(self, title):
        self.jobtitle = title


class ProductionWorker(Employee):
    def __init__(self, employee_id, fname, lname, department, jobtitle, shift, hourlyPayRate):
        super().__init__(employee_id, fname, lname, department, jobtitle)
        self.shift = shift
        self.hourlyPayRate = hourlyPayRate

    def __str__(self):
        shift_name = {1: "First", 2: "Second", 3: "Third"}.get(self.shift, "Unknown")
        return (
            super().__str__()
            + f"{CYAN}Shift:{RESET} {shift_name}\n"
            + f"{CYAN}Hourly Pay Rate:{RESET} ${self.hourlyPayRate:.2f}\n"
        )

    def getShift(self):
        return self.shift

    def getRate(self):
        return self.hourlyPayRate

    def setShift(self, value):
        self.shift = value


class ShiftSupervisor(Employee):
    def __init__(self, employee_id, fname, lname, department, jobtitle, annualSalary, yearlyBonus):
        super().__init__(employee_id, fname, lname, department, jobtitle)
        self.annualSalary = annualSalary
        self.yearlyBonus = yearlyBonus

    def __str__(self):
        return (
            super().__str__()
            + f"{CYAN}Annual Salary:{RESET} ${self.annualSalary:,.2f}\n"
            + f"{CYAN}Yearly Bonus:{RESET} ${self.yearlyBonus:,.2f}\n"
        )

    def getSalary(self):
        return self.annualSalary

    def getBonus(self):
        return self.yearlyBonus

    def setBonus(self, value):
        self.yearlyBonus = value


def main():
    employee = Employee("1001", "Joshua", "Gordon", "IT", "Support Specialist")
    worker = ProductionWorker("1002", "Ge", "Dinero", "Manufacturing", "Assembler", 2, 24.50)
    supervisor = ShiftSupervisor("1003", "Geneva", "Gordon", "Production", "Shift Supervisor", 65000, 5000)

    print(f"{PURPLE}=== EMPLOYEE ==={RESET}")
    print(employee)
    print(f"{BLUE}{'-' * 40}{RESET}")

    print(f"{PURPLE}=== PRODUCTION WORKER ==={RESET}")
    print(worker)
    print(f"{BLUE}{'-' * 40}{RESET}")

    print(f"{PURPLE}=== SHIFT SUPERVISOR ==={RESET}")
    print(supervisor)
    print(f"{BLUE}{'-' * 40}{RESET}")


main()