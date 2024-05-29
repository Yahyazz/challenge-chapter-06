class App {
  constructor() {
    this.inputTypeDriver = document.getElementById('inputTypeDriver');
    this.inputDate = document.getElementById('datepicker');
    this.inputTime = document.getElementById('inputTime');
    this.inputCapacity = document.getElementById('inputCapacity');
    this.filterBtn = document.getElementById('filter-btn');
    this.carContainerElement = document.getElementById('cars-container');
    this.totalDataFound = document.getElementById('totalDataFound');
  }

  async init() {
    this.filterBtn.onclick = await this.click;
  }

  async load(filter) {
    // let { available, availableAt, capacity } = filter;
    // const filterer = (car) => {
    //   if (car.available !== available) return false;
    //   if (new Date(car.availableAt) < new Date(availableAt)) return false;
    //   if (car.capacity < capacity) return false;
    //   console.log('Dari API', new Date(car.availableAt));
    //   console.log('Dari Input', new Date(availableAt));
    //   return true;
    // };
    const cars = await CarsData.filterCars(filter);
    this.totalDataFound.innerHTML = `Total Mobil Ditemukan ${cars.length}`;
    if (cars.length === 0) {
      this.carContainerElement.innerHTML = `
      <div class="col-12">
        <p class="roboto-medium fs-4 alert alert-danger" role="alert">Mobil tidak tersedia</p>
      </div>
      `;
    }
    console.log(cars);
    Car.init(cars);
  }

  click = async () => {
    this.clear();
    const toastAlert = document.getElementById('toastAlert');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastAlert);

    if (
      this.inputTypeDriver.value === '' ||
      this.inputDate.value === '' ||
      this.inputTime.value === ''
    )
      return toastBootstrap.show();
    let available = this.inputTypeDriver.value === 'true' ? true : false;
    let localDate = new Date(`${this.inputDate.value}T${this.inputTime.value}`);
    // console.log(this.inputDate.value);
    console.log('pure', localDate);
    let availableAt = localDate.toISOString();
    console.log('format', availableAt);
    let capacity = this.inputCapacity.value ? Number(this.inputCapacity.value) : 0;
    await this.load({ available, availableAt, capacity });
    this.run();
  };

  run = () => {
    let carsCard = '';
    if (Car.list.length !== 0) {
      Car.list.forEach((car) => {
        carsCard += car.render();
      });
      this.carContainerElement.innerHTML = carsCard;
    }
  };

  clear = () => {
    // let child = this.carContainerElement.firstElementChild;

    // while (child) {
    //   child.remove();
    //   child = this.carContainerElement.firstElementChild;
    // }
    this.carContainerElement.innerHTML = '';
  };
}
