class Car extends Component {
  static list = [];

  static init(cars) {
    this.list = cars.map((car) => new this(car));
  }

  constructor(props) {
    super(props);
    let {
      id,
      plate,
      manufacture,
      model,
      image,
      rentPerDay,
      capacity,
      description,
      transmission,
      available,
      type,
      year,
      options,
      specs,
      availableAt,
    } = props;
    this.id = id;
    this.plate = plate;
    this.manufacture = manufacture;
    this.model = model;
    this.image = image;
    this.rentPerDay = rentPerDay;
    this.capacity = capacity;
    this.description = description;
    this.transmission = transmission;
    this.available = available;
    this.type = type;
    this.year = year;
    this.options = options;
    this.specs = specs;
    this.availableAt = availableAt;
  }

  render() {
    // nama/tipe [manufacture+model?/type]
    // harga/hari [rentPerDay]
    // lorem..[description]
    // capacity [capacity]
    // manual? [transmission]
    // tahun [year]
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
    return `
    <div class="col-12 col-md-4 mb-4">
      <div class="card h-100">
        <img src="${this.image}" class="card-img-top img-cars-card" alt="${this.manufacture} ${
      this.model
    }">
        <div class="card-body d-flex flex-column justify-content-between">
          <div class="mb-3">
            <p class="card-title roboto-regular">${this.manufacture} ${this.model}/${this.type}</p>
            <p class="card-text roboto-bold fs-4">${formatter.format(this.rentPerDay)}/hari</p>
            <p class="card-text roboto-light">${this.description}</p>
            <div class="d-flex justify-content-start">
              <img src="../img/icon/fi_users.png" class="icon-cars-card me-2" alt="Icon" />
              <p class="roboto-light">${this.capacity} Orang</p>
            </div>
            <div class="d-flex justify-content-start">
              <img src="../img/icon/fi_settings.png" class="icon-cars-card me-2" alt="Icon" />
              <p class="roboto-light">${this.transmission}</p>
            </div>
            <div class="d-flex justify-content-start">
              <img src="../img/icon/fi_calendar.png" class="icon-cars-card me-2" alt="Icon" />
              <p class="roboto-light">Tahun ${this.year}</p>
            </div>
          </div>
          <div>
            <button class="btn btn-bd-primary bottom-0 w-100">Pilih Mobil</button>
          </div>
        </div>
      </div>   
    </div>
    `;
  }
}
