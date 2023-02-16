import { LightningElement, track } from 'lwc';

const resolve = Symbol('resolveConnectedCallback');
const connected = Symbol('connectedCallback');
const loading = Symbol('loading component');

export default class App extends LightningElement {
  @track dynamic = { activity: undefined, details: undefined };

  [loading] = false;
  [resolve] = false;
  [connected] = new Promise(res => this[resolve] = res);

  connectedCallback() {
    this[resolve]();
  }

  async loadComponents() {
    if (this[loading]) {
      return;
    }

    // awaits for the connectedCallback to run
    this[loading] = true;
    await this[connected];

    // Uses the default export from the LWC
    const [ activity, details ] = (await Promise.all([
      import('x/activity'),
      import('x/details'),
    ])).map(ns => ns.default);

    //const [ activity, details ] = loaded.map(ns => ns.default);

    // the LWC constructor is used by the lwc:is attribute of <lwc:component />
    this.dynamic.activity = activity;
    this.dynamic.details = details;

    // reloading is now available;
    this[loading] = false;
  }
}
