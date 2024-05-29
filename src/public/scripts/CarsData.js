function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class CarsData {
  static populateCars = (cars) => {
    return cars.map((car) => {
      const isPositive = getRandomInt(0, 1) === 1;
      const timeAt = new Date();
      const mutator = getRandomInt(1000000, 100000000);
      const availableAt = new Date(timeAt.getTime() + (isPositive ? mutator : -1 * mutator));

      return {
        ...car,
        availableAt,
      };
    });
  };

  static async filterCars(filterer) {
    let cars;
    let cachedCarsString = localStorage.getItem('CARS');

    if (!!cachedCarsString) {
      const cacheCars = JSON.parse(cachedCarsString);
      // cars = this.populateCars(cacheCars);
      cars = cacheCars;
    } else {
      // const response = await fetch('http://localhost:8000/api/cars'); kl udah jadi
      const response = await fetch(
        'https://raw.githubusercontent.com/fnurhidayat/probable-garbanzo/main/data/cars.min.json'
      );
      const body = await response.json();
      // cars = this.populateCars(body);
      cars = body;

      localStorage.setItem('CARS', JSON.stringify(cars));
    }

    // return cars.filter(filterer);
    let { available, availableAt, capacity } = filterer;
    const filteredCars = [];
    cars.map((car) => {
      let carAvailibility = car.available === available;
      let carAvailableAt = new Date(car.availableAt) >= new Date(availableAt);
      let carCapacity = car.capacity >= capacity;
      if (carAvailibility && carAvailableAt && carCapacity) {
        filteredCars.push(car);
      }
    });
    return filteredCars;
  }
}
