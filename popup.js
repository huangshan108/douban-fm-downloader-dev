var prevSongTitle;

chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.title != prevSongTitle) {
		if (request.action == "getSource") {
			// // message.innerText = request.url + request.picture + request.albumtitle + request.artist + request.title;
			prevSongTitle = request.title;

			var htmlStr = '<div class="popup"><div class="col-xs-3 no-padding"><img src="' + request.picture + '"></div><div class="col-xs-6 no-padding"><h6>歌曲专辑：' + request.albumtitle + '</h6><h6>歌曲名称：'+ request.title + '</h6><h6>歌手：' + request.artist + '</h6></div><div class="col-xs-2 no-padding"><a href="' + request.url + '" class=" pull-right" download><span class="glyphicon glyphicon-arrow-down"></span></a></div></div>';
			$('#message').append(htmlStr);
		};
	};
});

// function onWindowLoad() {
  var message = document.querySelector('#message');
  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.extension.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
    }
  });
// }
// window.onload = onWindowLoad;