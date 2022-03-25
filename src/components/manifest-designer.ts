import { LitElement, html } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { Manifest } from "../interfaces/manifest";

import {
  provideFluentDesignSystem,
  fluentButton,
  fluentTextField,
  fluentSelect,
  fluentOption,
  fluentDivider
} from "@fluentui/web-components";

import "@shoelace-style/shoelace/dist/components/color-picker/color-picker";
import { getManifestInfo } from "../checks/manifest";

provideFluentDesignSystem().register(
  fluentButton(),
  fluentTextField(),
  fluentSelect(),
  fluentOption(),
  fluentDivider()
);

interface InputItem {
  title: string;
  description: string;
  entry: string;
  type: 'input' | 'select' | 'radios' | 'color-picker';
  menuItems?: Array<string>;
}

const infoItems: Array<InputItem> = [
  {
    title: 'Name',
    description: '',
    entry: 'name',
    type: 'input',
  },
  {
    title: 'Short Name',
    description: '',
    entry: 'short_name',
    type: 'input',
  },
  {
    title: 'Description',
    description: '',
    entry: 'description',
    type: 'input',
  },
  {
    title: 'Categories',
    description: '',
    entry: 'categories',
    type: 'input',
  },
  {
    title: 'Display',
    description: '',
    entry: 'display',
    type: 'select',
    menuItems: ['fullscreen', 'standalone', 'minimal-ui', 'browser'],
  },
  {
    title: 'Background color',
    description: '',
    entry: 'background_color',
    type: 'color-picker',
  },
  {
    title: 'Theme color',
    description: '',
    entry: 'theme_color',
    type: 'color-picker',
  }
];

const settingsItems: Array<InputItem> = [
  {
    title: "Start URL",
    description: "",
    entry: 'start_url',
    type: 'input',
  },
  {
    title: "Scope",
    description: "",
    entry: 'scope',
    type: 'input',
  },
  {
    title: "Orientation",
    description: "",
    entry: 'orientation',
    type: 'select',
    menuItems: [
      'any',
      'natural',
      'landscape',
      'portrait',
      'portrait-primary',
      'portrait-secondary',
      'landscape-primary',
      'landscape-secondary',
    ],
  },
  {
    title: "Language",
    description: "",
    entry: 'lang',
    type: 'select',
    menuItems: ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'],
  },
];


@customElement("manifest-designer")
export class ManifestDesigner extends LitElement {

  @state()
  private manifest!: Manifest;

  async firstUpdated() {
    const manifestInfo = await getManifestInfo();
    if (manifestInfo && manifestInfo.manifest) {
        this.manifest = manifestInfo.manifest;
    }
    
    console.log('manifest', this.manifest);
    
  }
  
  render() {
    return html`
      <form id="form" class="">
        <p class="">The <a href="https://www.w3.org/TR/appmanifest/" target="_blank">Web App Manifest</a>
        is a JSON document that provides application metadata for <a href="https://developers.google.com/web/progressive-web-apps?hl=en" target="_blank">Progressive Web Apps</a>.
        Use the form below to generate the JSON file and optionally upload an app icon.</p>

        <p>Application Information</p>
        ${this.renderInputItems(infoItems)}
        <fluent-divider></fluent-divider>

        <p>Application Settings</p>
        ${this.renderInputItems(settingsItems)}
        <fluent-divider></fluent-divider>

        <p>Application Images</p>
        <fluent-divider></fluent-divider>

        <p>Advanced Capabilities</p>
        <fluent-divider></fluent-divider>

      </form>
      <!-- TODO: Show manifest in code-->
      <!-- TODO: Copy manifest JSON-->
      <!-- TODO: Upload icons-->
      <!-- TODO: Generate .zip-->
      <section class="">
      </section>
    `
  }

  renderInputItems(items: InputItem[]) {
    return items.map(item => {
      let field;
      const value =
        this.manifest && this.manifest[item.entry]
          ? this.manifest[item.entry]
          : '';

      if (item.type === 'select' && item.menuItems) {
        let index = item.menuItems.indexOf(value);

        if (index === -1) {
          (item.menuItems).find((value, index) => {
            index = index;
          });
        }

        field = html`
          <p>${item.title}</p>
          <fluent-select title="Select ${item.title}">
            ${item.menuItems.map(menuItem => {
              return html`
                <fluent-option value="${menuItem}">${menuItem}</fluent-option>
              `;
            }
          )}
          </fluent-select>
        `;
      } else if (item.type === 'color-picker') {
        field = html `
          <p>${item.title}</p>
          <sl-color-picker value="${value}" label="Select a color"></sl-color-picker>
        `
      } else {
        field = html`
          <fluent-text-field appearance="outline" placeholder="${item.title}" value="${value}">${item.title}</fluent-text-field>
        `;
      }

      return html`
        <div class="input-field">
          ${field}
        </div>
      `;
    });
  }

  
}
