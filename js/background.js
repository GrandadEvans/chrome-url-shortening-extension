var shortUrl,
    longUrl;

/**
 * Create a context menu which will only show up for images.
 */
function clear_notification() {
    chrome.notifications.clear('GEWD_notification', function (wasCleared) {
        if (wasCleared) {
            console.log("Notification was closed and successfully cleared");
        } else {
            console.log("Notification was successfully closed but failed to clear it");
        }
    });
}

function copyToClipboard(str) {
    //based on http://stackoverflow.com/a/12693636
    document.oncopy = function(event) {
        event.clipboardData.setData("Text", str);
        event.preventDefault();
    };
    document.execCommand("Copy");
    document.oncopy = undefined;
}

chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
    clear_notification();
});

chrome.notifications.onClicked.addListener(function (notificationId, index) {
    clear_notification();
});

chrome.notifications.onButtonClicked.addListener(function (notificationId, index) {
    console.log('Index: ', index);

    if (index === 0 || index === 1) {
        copyToClipboard(shortUrl);
     }

    if (index === 1) {
        chrome.tabs.create({
            "url": shortUrl
        });
    }
    clear_notification();
});

chrome.contextMenus.create({
    "title": "Get Short URLs",
"type":  "normal",
"contexts": ["all"],
"id":       "GE_get_short_urls"
});

chrome.contextMenus.create({
    "title" : "Get shortened page URL",
    "type" : "normal",
    "contexts" : ["all"],
    "parentId":  "GE_get_short_urls",
    "onclick" : getClickHandler('page')
});

chrome.contextMenus.create({
    "title" : "Get shortened link URL",
    "type" : "normal",
    "contexts" : ["link"],
    "parentId":  "GE_get_short_urls",
    "onclick" : getClickHandler('link')
});

chrome.contextMenus.create({
    "title" : "Get shortened image URL",
    "type" : "normal",
    "contexts" : ["image"],
    "parentId":  "GE_get_short_urls",
    "onclick" : getClickHandler('src')
});

chrome.contextMenus.create({
    "title" : "Get shortened video URL",
    "type" : "normal",
    "contexts" : ["video"],
    "parentId":  "GE_get_short_urls",
    "onclick" : getClickHandler('src')
});

chrome.contextMenus.create({
    "title" : "Get shortened audio URL",
    "type" : "normal",
    "contexts" : ["audio"],
    "parentId":  "GE_get_short_urls",
    "onclick" : getClickHandler('src')
});

function create_notification(shortUrl) {
    return chrome.notifications.create(
        'GEWD_notification',
        {
            "type": "basic",
            "iconUrl": "img/Internet-url-icon-64px.png",
            "appIconMaskUrl": "img/Internet-url-icon-64px.png",
            "title": "Shortened URL",
            "priority": 1,
            "message": "Your shortened URL is \n"+shortUrl,
            "buttons": [
                {
                    "title": "Copy to clipboard"
                },
                {
                    "title": "Copy to new tab then Test in new tab"
                }
            ]
        }, 
        function(id) {
            if (chrome.runtime.lastError) {
                console.log("Last error:", chrome.runtime.lastError);
            }
        });
}
function getClickHandler(type) {

    console.log("Type: ", type);
    

    return function(info, tab) {

        switch (type) {
            case 'page':
                var link = info.pageUrl;
                break;
            case 'link':
                var link = info.linkUrl;
                break;
            case 'src':
                var link = info.srcUrl;
                break;
        }

        // The link we need to call to get the shortened url
        var linkToCall = 'http://gewd.co/api.php?long='+link;
        console.log("Long URL: ", linkToCall);

        // Create a new request
        req = new XMLHttpRequest();

        // Set it to use a GET request to the link already specified using aSync
        req.open("GET", linkToCall, true);

        // check the onreadystate
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    
                    shortUrl = req.responseText.replace(/^\s+|\s+$/g,"");
                    console.log("Short URL: ", shortUrl);
                    
                    create_notification(shortUrl);
                }
            }
        }
        req.send();
    }
}




