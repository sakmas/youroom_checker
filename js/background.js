var interval;
var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url' : 'https://www.youroom.in/oauth/request_token',
    'authorize_url' : 'https://www.youroom.in/oauth/authorize',
    'access_url': 'https://www.youroom.in/oauth/access_token',
    'consumer_key' : '<your_consumer_key>',
    'consumer_secret' : '<your_consumer_secret>'
});

function setIcon() {
    if (oauth.hasToken()) {
        chrome.browserAction.setIcon({ 'path' : 'img/icon-19-on.png'});
    } else {
        chrome.browserAction.setIcon({ 'path' : 'img/icon-19-off.png'});
    };
};

function updateIconBadge(resp_json, xhr){
    var count = 0;
    var resps = JSON.parse(resp_json);
    resps.forEach(function(resp){
        count++;
        var unread_ids = resp.entry.unread_comment_ids;
        if (unread_ids != "") {
            count += unread_ids.split(",").length;
        };
    });
    chrome.browserAction.setBadgeText({
        text: count != 0 ? String(count) : ""
    });
    console.log(resps);
};

function getUnreads() {
    console.log("getUnreads");
    if (oauth.hasToken()){
        var url = "https://www.youroom.in/";
        var request = {
            'method': 'GET',
            'parameters': {
                'format': 'json',
                'read_state': 'unread'
            }
        };
        oauth.sendSignedRequest(url, updateIconBadge, request);
    };
};


function create() {
    if (oauth.hasToken()){
        var url = "https://www.youroom.in/r/14101/entries";
        var request = {
            'method': 'POST',
            'parameters': {
                'format': 'json',
                'entry[content]': 'post!!'
            }
        };
        oauth.sendSignedRequest(url, function(){}, request);
    };
};
    
    
    
function logout() {
    oauth.clearTokens();
    setIcon();
};

function startCheck(){
    if (oauth.hasToken()){
        interval = 600000;
        setInterval(getUnreads, interval);
    }
};

function getYouroomUrl(){
    var url = "https://www.youroom.in/";
    return url;
};

function isYouroomUrl(url){
    var youroom = getYouroomUrl();
    if (url.indexOf(youroom) != 0){
        return false;
    }
    return true;
};
    
function goToyouroom_in() {
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && isYouroomUrl(tab.url)) {
                chrome.tabs.update(tab.id, {selected: true});
                return;
            }
        };
        chrome.tabs.create({url: getYouroomUrl()});
    });
};

setIcon();
startCheck();

//chrome.browserAction.onClicked.addListener(function(){
//    if (oauth.hasToken()){
//        getUnreads();
//    };
//});

chrome.browserAction.onClicked.addListener(goToyouroom_in);
