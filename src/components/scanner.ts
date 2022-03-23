import { LitElement, html } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { getManifestUrl } from "../extensionHelpers";
import { fetchManifest } from "../manifest-utils";

@customElement("pwa-scanner")
export class PWAScanner extends LitElement {

  @state()
  private currentUrl!: string;
  private manifest!: any;

  async firstUpdated() {
    let url = await chrome.tabs.query({ active: true, currentWindow: true });
    if (url.length > 0) {
      this.currentUrl = url[0].url || "";
    }
  }
  
  render() {
    return html` <div>Current Url = ${this.currentUrl}</div> `;
  }
}
