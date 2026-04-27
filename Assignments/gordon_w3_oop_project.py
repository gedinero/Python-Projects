import turtle


class NetworkDevice:
    """Base class representing a generic network device."""

    def __init__(self, hostname, ip_address, device_type, status="online"):
        """Initialize a NetworkDevice with identity and status fields."""
        self.hostname = hostname
        self.ip_address = ip_address
        self.device_type = device_type
        self.status = status

    def __str__(self):
        """Return a one line summary string for this device."""
        return f"[{self.device_type}] {self.hostname} | {self.ip_address} | Status: {self.status}"

    def ping(self):
        """Simulate a ping to this device and return a result string."""
        return f"Reply from {self.ip_address}: bytes=32 time=2ms TTL=64"

    def get_info(self):
        """Return a formatted string with this device's details."""
        return (
            f"{self}\n"
            f"Hostname : {self.hostname}\n"
            f"IP       : {self.ip_address}\n"
            f"Type     : {self.device_type}\n"
            f"Status   : {self.status}"
        )

    def set_status(self, new_status):
        """Update the device status to the given string."""
        self.status = new_status


class Router(NetworkDevice):
    """A network router. Extends NetworkDevice with routing information."""

    def __init__(self, hostname, ip_address, routing_protocol="OSPF"):
        """Initialize a Router and call the parent constructor."""
        super().__init__(hostname, ip_address, device_type="router")
        self.routing_protocol = routing_protocol
        self.routes = []

    def get_info(self):
        """Override base get_info to include routing protocol and routes."""
        if not self.routes:
            self.show_routes()

        route_list = ", ".join(self.routes)
        return (
            f"{self}\n"
            f"Protocol : {self.routing_protocol}\n"
            f"Routes   : {route_list}"
        )

    def show_routes(self):
        """Return a simulated list of routes this router knows about."""
        if not self.routes:
            if self.routing_protocol.upper() == "OSPF":
                self.routes = ["10.0.0.0/8", "192.168.0.0/24", "0.0.0.0/0"]
            elif self.routing_protocol.upper() == "BGP":
                self.routes = ["172.16.0.0/16", "203.0.113.0/24", "0.0.0.0/0"]
            elif self.routing_protocol.upper() == "EIGRP":
                self.routes = ["192.168.10.0/24", "192.168.20.0/24", "10.10.10.0/24"]
            else:
                self.routes = ["192.168.1.0/24", "0.0.0.0/0"]
        return self.routes

    def add_route(self, route):
        """Add a route string to this router's route list."""
        self.routes.append(route)


class Switch(NetworkDevice):
    """A network switch. Extends NetworkDevice with VLAN and port information."""

    def __init__(self, hostname, ip_address, port_count=24):
        """Initialize a Switch and call the parent constructor."""
        super().__init__(hostname, ip_address, device_type="switch")
        self.port_count = port_count
        self.vlans = ["VLAN 1 (default)"]

    def get_info(self):
        """Override base get_info to include port count and VLAN list."""
        vlan_list = ", ".join(self.vlans)
        return (
            f"{self}\n"
            f"Ports    : {self.port_count}\n"
            f"VLANs    : {vlan_list}"
        )

    def show_vlans(self):
        """Return the current list of VLAN description strings."""
        return self.vlans

    def add_vlan(self, vlan_description):
        """Add a VLAN description string to this switch's VLAN list."""
        self.vlans.append(vlan_description)


class DeviceManager:
    """Manages a collection of NetworkDevice objects."""

    def __init__(self):
        """Initialize with an empty device list."""
        self.devices = []

    def add_device(self, device):
        """Add a NetworkDevice or subclass object to the devices list."""
        self.devices.append(device)
        print(f"{device.hostname} added successfully.")

    def remove_device(self, hostname):
        """Remove the device with the given hostname. Print a message if not found."""
        for device in self.devices:
            if device.hostname.lower() == hostname.lower():
                self.devices.remove(device)
                print(f"{hostname} removed successfully.")
                return
        print(f"Device '{hostname}' not found.")

    def find_device(self, hostname):
        """Return the device object matching hostname, or None if not found."""
        for device in self.devices:
            if device.hostname.lower() == hostname.lower():
                return device
        return None

    def list_all(self):
        """Print the get_info output for every device in the list."""
        if not self.devices:
            print("No devices in manager.")
            return

        print("\n--- Network Devices ---")
        for device in self.devices:
            print(device.get_info())
            print("-" * 40)


def show_menu():
    """Display the main menu options."""
    print("\n=== Network Device Manager ===")
    print("1. Add Router")
    print("2. Add Switch")
    print("3. List Devices")
    print("4. Ping Device")
    print("5. Draw Topology")
    print("6. Remove Device")
    print("7. Exit")


def handle_add_router(manager):
    """Prompt the user for router details and add a router."""
    hostname = input("Enter router hostname: ")
    ip_address = input("Enter router IP address: ")
    routing_protocol = input("Enter routing protocol (OSPF/BGP/EIGRP/Static): ")

    router = Router(hostname, ip_address, routing_protocol)
    router.show_routes()
    manager.add_device(router)


def handle_add_switch(manager):
    """Prompt the user for switch details and add a switch."""
    hostname = input("Enter switch hostname: ")
    ip_address = input("Enter switch IP address: ")

    try:
        port_count = int(input("Enter port count: "))
    except ValueError:
        print("Invalid port count. Using default of 24.")
        port_count = 24

    switch = Switch(hostname, ip_address, port_count)
    switch.add_vlan("VLAN 10 (mgmt)")
    switch.add_vlan("VLAN 20 (servers)")
    manager.add_device(switch)


def handle_ping(manager):
    """Prompt for a hostname and ping the matching device."""
    hostname = input("Enter hostname to ping: ")
    device = manager.find_device(hostname)

    if device is None:
        print(f"Device '{hostname}' not found.")
    else:
        print(device.ping())


def handle_remove(manager):
    """Prompt for a hostname and remove the matching device."""
    hostname = input("Enter hostname to remove: ")
    manager.remove_device(hostname)


def draw_topology(manager):
    """Draw a simple network topology using turtle."""
    if not manager.devices:
        print("No devices to draw.")
        return

    screen = turtle.Screen()
    screen.title("Network Topology")
    screen.bgcolor("#0a0e1a")

    t = turtle.Turtle()
    t.speed(0)
    t.hideturtle()
    t.pensize(2)

    x_start = -250
    x_step = 150
    y_pos = 0

    for i, device in enumerate(manager.devices):
        x = x_start + (i * x_step)

        t.penup()
        t.goto(x, y_pos)
        t.pendown()

        if device.device_type == "router":
            t.fillcolor("#10b981")
        else:
            t.fillcolor("#3b82f6")

        t.color("white")
        t.begin_fill()
        for _ in range(2):
            t.forward(60)
            t.left(90)
            t.forward(40)
            t.left(90)
        t.end_fill()

        t.penup()
        t.goto(x + 30, y_pos - 20)
        t.color("white")
        t.write(device.hostname, align="center", font=("Arial", 9, "normal"))

    turtle.done()


def main():
    """Run the main program loop for the network device manager."""
    manager = DeviceManager()

    while True:
        show_menu()
        choice = input("Choose an option: ")

        if choice == "1":
            handle_add_router(manager)
        elif choice == "2":
            handle_add_switch(manager)
        elif choice == "3":
            manager.list_all()
        elif choice == "4":
            handle_ping(manager)
        elif choice == "5":
            draw_topology(manager)
        elif choice == "6":
            handle_remove(manager)
        elif choice == "7":
            print("Exiting program.")
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()