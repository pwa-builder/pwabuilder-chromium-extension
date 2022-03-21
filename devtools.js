chrome.devtools.panels.create("Hello World",
            "icon_512.png",
            "panel.html",
            (panel) => {
                console.log(panel);
            });