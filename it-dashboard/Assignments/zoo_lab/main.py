from animal import Dog, Bird, Fish
from habitat import Habitat
from zoo import Zoo
from zookeeper import Zookeeper

# Create animals
dog = Dog("Rex", "German Shepherd")
bird1 = Bird("Tweety", True)
bird2 = Bird("Penguin Pete", False)
fish = Fish("Nemo", "Saltwater")

# Create habitats
savanna = Habitat("Savanna Exhibit", "tropical", 5)
aviary = Habitat("Sky Dome Aviary", "temperate", 10)
aquarium = Habitat("Deep Blue Aquarium", "aquatic", 20)

# Add animals to habitats
savanna.add_animal(dog)
aviary.add_animal(bird1)
aviary.add_animal(bird2)
aquarium.add_animal(fish)

# Create zoo
zoo = Zoo("Hexworth Wildlife Park")
zoo.add_habitat(savanna)
zoo.add_habitat(aviary)
zoo.add_habitat(aquarium)

# Create zookeeper
keeper = Zookeeper("Sara", "Birds")
keeper.assign(aviary)

zoo.hire_keeper(keeper)

# Run reports
zoo.full_report()
keeper.daily_report()