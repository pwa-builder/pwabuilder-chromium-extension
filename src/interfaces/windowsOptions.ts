export interface WindowsOptions {
  url: string;
  name: string;
  packageId: string;
  version: string;
  allowSigning: boolean;
  classicPackage: {
    generate: boolean;
    version: string;
  };
  publisher: {
    displayName: string;
    commonName: string;
  };
}

export interface Manifest {
  name: string;
  short_name: string;
  start_url: string;
  description: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
  }[];
  display: string;
  orientation: string;
  background_color: string;
  theme_color: string;
  related_applications: {
    platform: string;
    url: string;
  }[];
  lang: string;
  dir: string;
  prefer_related_applications: boolean;
  id: string;
  scope: string;
}
