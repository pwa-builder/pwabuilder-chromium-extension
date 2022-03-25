import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  provideFluentDesignSystem,
  fluentButton,
  fluentAccordion,
  fluentAccordionItem,
} from "@fluentui/web-components";

import "@lottiefiles/lottie-player";
import "@shoelace-style/shoelace/dist/components/progress-ring/progress-ring";
import "@shoelace-style/shoelace/dist/components/badge/badge";

import { runManifestChecks } from "../utils/manifest";
import { TestResult } from "../interfaces/manifest";
import { testSecurity } from "../checks/security";
import { getSwInfo } from "../checks/sw";
import { getManifestInfo } from "../checks/manifest";

provideFluentDesignSystem().register(
  fluentButton(),
  fluentAccordion(),
  fluentAccordionItem()
);

@customElement("pwa-scanner")
export class PWAScanner extends LitElement {
  static styles = [
    css`
      .root {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
      }

      .go-button {
        margin: 20px;
      }

      fluent-accordion{
        width: -webkit-fill-available;
      }

      .item-passed {
        color: green;
      }

      .item-failed {
        color: red;
      }

      .rings {
        display: flex;
        flex-direction: row;
        padding: 10px;
      }

      .rings pwa-scanner-ring {
        margin: 10px;
      }

    `,
  ];

  @state()
  private currentUrl!: string;

  @state()
  private testResults!: TestResult[];

  async firstUpdated() {
    let url = await chrome.tabs.query({ active: true, currentWindow: true });
    if (url.length > 0) {
      this.currentUrl = url[0].url || "";
    }

    console.log("fetching site info");
    // const siteInfo = await getSiteInfo();
    // console.log(siteInfo);

    // this.testResults = await runManifestChecks({
    //   manifestUrl: siteInfo.manifest.manifestUri!,
    //   initialManifest: siteInfo.manifest.manifest!,
    //   siteUrl: this.currentUrl,
    //   isGenerated: false,
    //   isEdited: false,
    //   manifest: siteInfo.manifest.manifest!,
    // });

    // if (siteInfo.sw.hasSW) {
    //   console.log('service worker tests', analyzeSW(siteInfo.sw.rawSW!))
    // }

    // console.log('manifest tests', this.testResults);

    console.log("manifest", await getManifestInfo());
    console.log("sw", await getSwInfo());
    console.log('security', await testSecurity(this.currentUrl));

  }

  render() {
    return html`
      <div class="root">
        <div>Current Url = ${this.currentUrl}</div>

        <div class="rings">
          <pwa-scanner-ring type="good" label="Manifest" value="75" content="15/19" ></pwa-scanner-ring>
          <pwa-scanner-ring type="ok" label="Service Worker" value="25" content="1/4" ></pwa-scanner-ring>
          <pwa-scanner-ring type="bad" label="Security" value="0" content="!" ></pwa-scanner-ring>
        </div>

        ${this.testResults && this.testResults.length > 0
          ? html`
              <fluent-accordion>
                ${this.testResults.map(
                  (result) => html`
                    <fluent-accordion-item>
                      <div .className=${result.result ? 'item-passed' : 'item-failed'} slot="heading">
                        <sl-badge variant="${result.result ? 'success' : 'danger'}">${result.result ? 'Passed' : 'Failed'}</sl-badge>
                        ${result.infoString} 
                      </div>
                      <div slot="panel">${result.result}</div>
                    </fluent-accordion-item>
                  `
                )}
              </fluent-accordion>
            `
          : html`
              <lottie-player
                src="https://assets5.lottiefiles.com/packages/lf20_odcijnjo.json"
                background="transparent"
                speed="1"
                style="width: 150px; height: 150px;"
                loop
                autoplay
              ></lottie-player>
              <div>
                Welcome to the best extension in the world. Are you ready to run
                the scanner and take your PWA to the next level?
              </div>
              <fluent-button class="go-button" appearance="accent"
                >Let's do it!</fluent-button
              >
            `}
      </div>
    `;
  }

  renderProgressRing(label: string, value: number, content: string, className: string) {
    
  }
}


@customElement("pwa-scanner-ring")
export class PWAScannerRing extends LitElement {

  static styles = [
    css`
      .root {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
      }

      sl-progress-ring {
        --size: 68px;
        --track-width: 5px;
        font-size: 15px;
      }

      sl-progress-ring.good {
        --indicator-color: green;
      }

      sl-progress-ring.bad {
        --indicator-color: red;
        --track-color: #ff000026;
      }

      sl-progress-ring.ok {
        --indicator-color: orange;
      }

      .label {
        font-size: 16px;
      }
    `
  ]

  @property({type: Number}) public value: number = 0;
  @property({type: String}) public type: "good" | "bad" | "ok" | "default" = "default";
  @property({type: String}) public label: string | undefined;;
  @property({type: String}) public content: string | undefined;

  render() {
    return html`
    <div class="root">
      <sl-progress-ring .className=${this.type} value="${this.value}">
        ${this.content}
      </sl-progress-ring>
      <span class="label">
        ${this.label}
      </span>
    </div>
    `;
  }

}