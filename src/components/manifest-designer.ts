import { LitElement, html } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { getManifestUrl } from "../extensionHelpers";
import { Manifest } from "../interfaces/manifest";
import { fetchManifest } from "../utils/manifest";

@customElement("manifest-designer")
export class ManifestDesigner extends LitElement {

  @state()
  private manifest!: Manifest;

  async firstUpdated() {
    const manifestUri = await getManifestUrl();
    const manifest = await fetchManifest(manifestUri!);
    if (manifest) {
        this.manifest = manifest;
    }
    
    console.log('manifest', this.manifest);
    
  }
  
  render() {
    // if (this.manifest) {
    //     return html` <div>Something that's working: ${this.manifest.short_name}</div> `;
    // } else {
    //     // TODO: Fetch default manifest to download
    //     return html` <div>No manifest found. You can download this default manifest.json file and add it to your project.</div> `;
    // }
    return html`
      
    `
  }
}
