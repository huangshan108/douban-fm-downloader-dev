// chrome.browserAction.onClicked.addListener(function(tab) {
// 	var id;
// 	chrome.tabs.getSelected(null, function (tab) {  
// 		id=tab.id;
// 	}); 
// 	chrome.tabs.executeScript(id, {file: "jquery-1.8.3.min.js"}, function(){
// 	    chrome.tabs.executeScript(id, {file: "hack.js"}, function(){

// 	    });
// 	});
// });

// $("#simulate-sec").prepend('<button id="download" style="margin:0; width:100px; height:26px;background:none;border:1px solid #9DD6C5;outline:none; color:#65C39E; position:relative; right: -90;left: 240px;" id="download">下载这首歌</button>');
// $("#download").mouseover(function() {
// 	$("#download").css({"background-color":"#9DD6C5", "color":"white", "-o-transition":".2s", "-ms-transition":".2s","-moz-transition":".2s","-webkit-transition":".2s","transition":".2s"});
// });
// $("#download").mouseout(function() {
// 	$('#download').css({"background-color":"transparent", "color":"#65C39E","-o-transition":".2s", "-ms-transition":".2s","-moz-transition":".2s","-webkit-transition":".2s","transition":".2s"});
// });

// var script = document.createElement("script");
// script.appendChild(document.createTextNode("window.extStatusHandler = function(a) {var o = jQuery.parseJSON(a);console.log(o.song.url);};"));
// (document.body || document.head || document.documentElement).appendChild(script);alert("Script Enjected Successfully!");

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "content_script.js"});
});