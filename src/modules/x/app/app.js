import { LightningElement } from 'lwc';

const resolve = Symbol('resolveConnectedCallback');
const connected = Symbol('connectedCallback');
const loading = Symbol('loading component');

export default class App extends LightningElement {
  [loading] = false;
  [resolve] = false;
  [connected] = new Promise(res => this[resolve] = res);

  componentConstructor;
  tabs = [
      {
          key: 0,
          name: 'Home',
          cmp: 'home'
      },
      {
          key: 1,
          name: 'Activities',
          cmp: 'activities'
      },
      {
          key: 2,
          name: 'Details',
          cmp: 'details'
      },
  ];

  connectedCallback() {
    this[resolve]();
  }

  async loadComponents({ target: { value }}) {
    if (this[loading]) {
      return;
    }

    const cmp = this.tabs[value].cmp;

    // Uses cached component if it's already loaded
    if (typeof cmp !== 'string') {
      this.componentConstructor = cmp;
      return;
    }

    // awaits for the connectedCallback to run
    this[loading] = true;
    await this[connected];

    // Uses the default export from the LWC
    const { defalt: loaded } = await import(`x/${cmp}`);

    // the LWC constructor is used by the lwc:is attribute of <lwc:component />
    this.componentConstructor = loaded;

    // Store loaded component to avoid new imports
    his.tabs[value].cmp = loaded;

    // reloading is now available;
    this[loading] = false;
  }
}
