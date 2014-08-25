chrome.extension.sendMessage({
    action: "getSource",
    url: document.getElementById("aLink").getAttribute('href'),
   	picture: document.getElementById("aLink").getAttribute('picture'),
    albumtitle: document.getElementById("aLink").getAttribute('albumtitle'),
    artist: document.getElementById("aLink").getAttribute('artist'),
    title: document.getElementById("aLink").getAttribute('title')
});