import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { windowsEndpoint } from "../endpoints";
import { getManifestUrl } from "../extensionHelpers";
import { WindowsOptions } from "../interfaces";

@customElement("package-windows")
export class PackageWindows extends LitElement {
  @state() currentManiUrl: string | undefined = undefined;

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  public async firstUpdated() {
    this.currentManiUrl= await getManifestUrl();

    if (this.currentManiUrl) {
        
    }
  }

  private async packageForWindows(options: any) {
    let response: Response | undefined;

    try {
      response = await fetch(windowsEndpoint, {
        method: "POST",
        body: JSON.stringify(options),
        headers: new Headers({ "content-type": "application/json" }),
      });
    } catch (err) {
      return err;
    }

    return response;
  }

  private setUpOptions(
    url: string,
    name: string,
    packageId: string,
    version: string,
    classicVersion: string,
    allowSigning: boolean = true,
    publisherDisplayName: string,
    publisherCommonName: string
  ): WindowsOptions {
    return {
      url,
      name,
      packageId,
      version,
      allowSigning,
      classicPackage: {
        generate: true,
        version: classicVersion,
      },
      publisher: {
        displayName: publisherDisplayName,
        commonName: publisherCommonName,
      },
    };
  }

  render() {
    return html`
      <h1>Package for The Microsoft Store</h1>

      <form></form>
    `;
  }
}
