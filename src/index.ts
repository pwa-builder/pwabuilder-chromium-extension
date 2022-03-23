import { LitElement, html } from "lit";
import {customElement} from 'lit/decorators.js';
import './components/scanner';
import './components/package-windows';
import './components/manifest-validator';


@customElement("pwa-extension")
export class PwaExtension extends LitElement {

  render() {
    return html`
      <h1>PWA Builder Extension</h1>
      <pwa-scanner></pwa-scanner>
      <manifest-validator></manifest-validator>`
    ;
  }

}