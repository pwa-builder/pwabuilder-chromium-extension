import { LitElement, html } from "lit";
import {customElement} from 'lit/decorators.js';
import './components/scanner';
import './components/package-windows';
import './components/manifest-designer';

import {
  provideFluentDesignSystem,
  fluentTabs,
  fluentTab,
  fluentTabPanel
} from "@fluentui/web-components";

provideFluentDesignSystem().register(
  fluentTabs(),
  fluentTab(),
  fluentTabPanel()
);


@customElement("pwa-extension")
export class PwaExtension extends LitElement {

  render() {
    return html`
    <fluent-tabs>
      <fluent-tab id="validate">Validate</fluent-tab>
      <fluent-tab id="manifest">Manifest</fluent-tab>
      <fluent-tab id="package">Package</fluent-tab>

      <fluent-tab-panel id="validatePanel">
        <pwa-scanner></pwa-scanner>
      </fluent-tab-panel>

      <fluent-tab-panel id="validatePanel">
        <manifest-designer></manifest-designer>
      </fluent-tab-panel>

      <fluent-tab-panel id="validatePanel">
        Package
      </fluent-tab-panel>
    </fluent-tabs>
    `
    ;
  }

}