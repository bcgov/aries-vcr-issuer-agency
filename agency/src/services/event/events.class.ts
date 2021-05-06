import { Application } from '../../declarations';

interface ServiceOptions { }

export class Events {
  app: Application;
  options: ServiceOptions;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: ServiceOptions = {}, app: Application) {
    this.app = app;
    this.options = options;
  }

  // Required so tsc wont throw an error
  setup() { }
}
