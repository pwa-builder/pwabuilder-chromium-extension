export async function getTabId() {
    var tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0].id;
}