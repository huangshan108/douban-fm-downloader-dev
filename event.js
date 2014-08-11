chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    code: 'var script = document.createElement("script");script.appendChild(document.createTextNode("window.extStatusHandler = function(a) {var o = jQuery.parseJSON(a);console.log(o.song.url);};"));(document.body || document.head || document.documentElement).appendChild(script);alert("Script Enjected Successfully!");'
  });
});