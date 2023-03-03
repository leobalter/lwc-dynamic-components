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
          cmp: () => import('x/home')
      },
      {
          key: 1,
          name: 'Activities',
          cmp: () => import('x/activities')
      },
      {
          key: 2,
          name: 'Details',
          cmp: () => import('x/details')
      },
  ];

  connectedCallback() {
    this[resolve]();
  }

  async loadComponents({ target: { value }}) {
    const cmp = this.tabs[value].cmp;

    // awaits for the connectedCallback to run
    this[loading] = true;
    await this[connected];

    // Uses the default export from the LWC
    const { defalt: loaded } = await cmp();

    // the LWC constructor is used by the lwc:is attribute of <lwc:component />
    this.componentConstructor = loaded;

    // reloading is now available;
    this[loading] = false;
  }
}
