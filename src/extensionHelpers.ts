import { ManifestDetectionResult, ServiceWorkerDetectionResult, SiteData } from "./interfaces/validation";

export async function getTabId() {
    var tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0].id;
}

let siteInfoPromise: Promise<SiteData>;

export function getSiteInfo() : Promise<SiteData> {
    if (siteInfoPromise) {
        return siteInfoPromise;
    }

    siteInfoPromise = new Promise(async (resolve, reject) => {
        const listener = (message: any, sender: any, sendResponse: any) => {
            // we finally have all the info we need for the service worker
            resolve(message);
            chrome.runtime.onMessage.removeListener(listener);
            sendResponse(true);
        }

        chrome.runtime.onMessage.addListener(listener)

        const tabId = await getTabId();
        if (tabId) {
            await chrome.scripting.executeScript({
                target: {tabId},
                func: runContentScriptIsolated,
            });

            await chrome.scripting.executeScript({
                target: {tabId},
                func: runContentScriptOnPage,
                world: "MAIN"
            });
        } else {
            reject("No active tab found");
        }
    });

    return siteInfoPromise;
}



// running code on page allowing us to get the service worker registration
function runContentScriptOnPage() {
    navigator.serviceWorker.ready.then(registration => {
    console.log(registration);
        const swInfo = {
            scope: registration.scope,
            scriptUrl: registration.active?.scriptURL,
            state: registration.active?.state,
        }

        window.postMessage({type: "serviceWorkerGetter", serviceWorkerRegistration: registration.active?.scriptURL}, "*");
    });
}

// running code isolated so we can use messaging back to extension
// should be run first to setup window message listener for messages from other content script
function runContentScriptIsolated() {

    const serviceWorkerPromise = new Promise<ServiceWorkerDetectionResult>((resolve, reject) => {
        const callback = (event: MessageEvent) => {
            if (event.source !== window) {
                return;
            }
    
            if (event.data.type && event.data.type === 'serviceWorkerGetter') {
                window.removeEventListener("message", callback);
                resolve(event.data.serviceWorkerRegistration);
            }
        };
    
        window.addEventListener("message", callback)
    })

    const manifestPromise = new Promise<ManifestDetectionResult>((resolve, reject) => {
        const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
        if (link) {
            const manifestUri = link.href;

            fetch(manifestUri, { credentials: "include" }). then(response => {
                return response.json();
            }).then(manifest => {
                resolve({
                    manifestUri,
                    manifest
                });
            });
        } else {
            return null;
        }
    });

    
    Promise.all([serviceWorkerPromise, manifestPromise]).then(([serviceWorkerRegistration, manifestInfo]) => {
        const data: SiteData = {
            sw: serviceWorkerRegistration,
            manifest: manifestInfo
        };

        chrome.runtime.sendMessage<SiteData>(data);
    });


    return null;
}