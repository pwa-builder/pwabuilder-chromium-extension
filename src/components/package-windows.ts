import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { windowsEndpoint } from "../endpoints";
import { WindowsOptions } from "../interfaces";

@customElement("package-windows")
export class PackageWindows extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  async packageForWindows(options: any) {
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

  setUpOptions(
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
    return html` <h1>Package for The Microsoft Store</h1> `;
  }
}
