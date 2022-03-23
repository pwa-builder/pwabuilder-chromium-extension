export async function getTabId() {
    var tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0].id;
}

export function getManifestUrl() : Promise<string | undefined> {
    return new Promise(async (resolve, reject) => {
        function getManifestUriInjected() {
            const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
            if (link) {
                return link.href;
            } else {
                return null;
            }
        }

        const tabId = await getTabId();

        if (tabId) {
            const scriptResult = await chrome.scripting.executeScript({
                target: {tabId},
                func: getManifestUriInjected,
            });

            if (scriptResult && scriptResult.length > 0) {
                const result = scriptResult[0].result;
                resolve(result);
            } else {
                resolve(undefined);
            }

        } else {
            reject("No active tab found");
        }
    });
}

export function getServiceWorker() : Promise<string | undefined> {
    return new Promise(async (resolve, reject) => {

        // serviceWorker.ready is only available on the page, not in content script
        // however, chrome.runtime.sendMessage is only available in content script (without an extension id)
        // messaging the serviceworker registration from a script on the page, to a content script, to the extension
        function fetchServiceWorkerRegistration() {
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

        function receiveServiceWorkerRegistration() {
            const callback = (event: MessageEvent) => {
                if (event.source !== window) {
                    return;
                }

                if (event.data.type && event.data.type === 'serviceWorkerGetter') {
                    chrome.runtime.sendMessage(event.data);
                    window.removeEventListener("message", callback);
                }
            };

            window.addEventListener("message", callback)
            return null;
        }

        const listener = (message: any) => {
            // we finally have all the info we need for the service worker
            resolve(message);
            chrome.runtime.onMessage.removeListener(listener);
            return true;
        }

        chrome.runtime.onMessage.addListener(listener)

        const tabId = await getTabId();
        if (tabId) {
            await chrome.scripting.executeScript({
                target: {tabId},
                func: receiveServiceWorkerRegistration,
            });

            await chrome.scripting.executeScript({
                target: {tabId},
                func: fetchServiceWorkerRegistration,
                world: "MAIN"
            });
        } else {
            reject("No active tab found");
        }
    });
}