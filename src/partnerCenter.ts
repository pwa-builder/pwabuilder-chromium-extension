import { WindowsOptions } from "./interfaces/windowsOptions";
import * as zip from "@zip.js/zip.js";

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadBlob(blob: Blob, name = 'file.txt') {

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = data;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
}

(async function() {

    console.log('Hello from extension');

    // const uploader = document.querySelector('input[type="file"]') as HTMLElement;
    
    const partnerCenterRegex = /https:\/\/partner\.microsoft\.com\/[\w-]+\/dashboard\/products\/(\w+)\/submissions\/\d+\/packages/g;
    const match = partnerCenterRegex.exec(window.location.href);
    
    if (!match || match.length <= 1) {
        return;
    }
    console.log('Extension: we have a match');
    
    let header = document.querySelector('.page-title-header');
    
    let currentDelay = 0
    while (!header && currentDelay < 10) {
        await delay(1000);
        currentDelay++;
        header = document.querySelector('.page-title-header');
    }
    
    let ourForm = document.querySelector("div[data-pwa-form]") as HTMLDivElement;
    const packageName = match[1];   
    
    
    if (ourForm) {
        return;
    }
    
    
    ourForm = document.createElement('div');
    ourForm.dataset.pwaForm = 'true';
    
    ourForm.innerHTML = `
        <label for="url">PWA Url to package</label>
        <input type="text" name="url"></input>
        <button>Package PWA</button>
        `;

const button = ourForm.querySelector('button');
const input = ourForm.querySelector('input') as HTMLInputElement;
button?.addEventListener('click', async () => {
    const publisherDataResponse = await fetch("https://partner.microsoft.com/dashboard/packages/api/pkg/v2.0/packageidentities?productbigid=" + packageName);
    const publisherData = await publisherDataResponse.json();
    
    console.log('publisherData', publisherData);
    
    let nameList = publisherData.Name.split('.');
    let name = nameList[nameList.length - 1];
    
    const windowsOptions: WindowsOptions = {
        url: input.value,
            name,
            packageId: publisherData.Name,
            version: "1.0.0",
            allowSigning: true,
            classicPackage: {
                generate: false,
                version: "1.0.0"
            },
            publisher: {
                displayName: publisherData.PublisherDisplayName,
                commonName: publisherData.Publisher,
            }
        }
        
        try {
            const packageResponse = await fetch("https://pwabuilder-winserver.centralus.cloudapp.azure.com/msix/generatezip", {
                method: "POST",
                body: JSON.stringify(windowsOptions),
                headers: new Headers({ "content-type": "application/json" }),
            });
            if (packageResponse) {
                const data = await packageResponse.blob();
                
                const blobReader = new zip.ZipReader(new zip.BlobReader(data));
                const entries = await blobReader.getEntries();
                console.log(entries);
                
                if (entries.length > 0) {
                    const uploader = document.querySelector('input[type="file"]') as HTMLInputElement;
                    const bundles = entries.filter(entry => entry.filename.endsWith('.msixbundle'));
                    if (bundles.length > 0) {
                        const bundle = bundles[0];
                        const bundleBlob: Blob = await (bundle as any).getData(new zip.BlobWriter());
                        
                        let file = new File([bundleBlob], bundle.filename);
                        let container = new DataTransfer();
                        container.items.add(file);
                        uploader.files = container.files;
                        if (uploader.onchange){
                            uploader.onchange(new Event('change'));
                        }
                        uploader.dispatchEvent(new Event('change'));
                        console.log(uploader.files);
                    }
                }
                
                // downloadBlob(data, 'yourpwa.zip');
                // const url = URL.createObjectURL(data);
                // console.log("url", url);

                // await chrome.downloads.download({
                //     url,
                //     filename: `app.zip`,
                //     saveAs: true,
                // });
                // console.log("done downloading");

                

                // window.location.replace(url)
            }
        } catch (err) {
            console.error(err);
        }
    });

    header?.appendChild(ourForm);
})();