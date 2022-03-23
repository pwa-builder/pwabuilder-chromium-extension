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

// export function getServiceWorker() : Promise<string | undefined> {
//     return new Promise(async (resolve, reject) => {
//         function getManifestUriInjected() {
//             const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
//             if (link) {
//                 return link.href;
//             } else {
//                 return null;
//             }
//         }

//         const tabId = await getTabId();

//         if (tabId) {
//             const scriptResult = await chrome.scripting.executeScript({
//                 target: {tabId},
//                 func: getManifestUriInjected,
//             });

//             if (scriptResult && scriptResult.length > 0) {
//                 const result = scriptResult[0].result;
//                 resolve(result);
//             } else {
//                 resolve(undefined);
//             }

//         } else {
//             reject("No active tab found");
//         }
//     });
// }