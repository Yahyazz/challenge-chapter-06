class Component {
  constructor(props) {
    if (this.constructor === Component) {
      throw new Error('Component is an abstract class and cannot be instantiated directly.');
    }
  }

  render() {
    // throw new Error('Method render() must be implemented.');
  }
}
