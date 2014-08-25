jQuery("#simulate-sec").prepend('<a id="aLink" href="#" download="song.mp3" style="position: relative; left: 240px; background:none"><button id="download" style="margin:0; width:100px; height:26px;background:none;border:1.5px solid #9DD6C5;outline:none; color:#65C39E;" id="download">下载这首歌</button></a>');
jQuery("#download").mouseover(function() {
	jQuery("#download").css({"background-color":"#9DD6C5", "color":"white", "-o-transition":".2s", "-ms-transition":".2s","-moz-transition":".2s","-webkit-transition":".2s","transition":".2s"});
});
jQuery("#download").mouseout(function() {
	jQuery('#download').css({"background-color":"transparent", "color":"#65C39E","-o-transition":".2s", "-ms-transition":".2s","-moz-transition":".2s","-webkit-transition":".2s","transition":".2s"});
});
jQuery(document).ready(function() {
    var script = document.createElement("script");
script.appendChild(document.createTextNode("window.extStatusHandler = function(a) {var o = jQuery.parseJSON(a);console.log(o);if (o.song != null) {url = o.song.url;picture = o.song.picture;albumtitle = o.song.albumtitle;artist = o.song.artist;title = o.song.title;jQuery('#simulate-sec a').attr('href', url);jQuery('#simulate-sec a').attr('picture', picture);jQuery('#simulate-sec a').attr('albumtitle', albumtitle);jQuery('#simulate-sec a').attr('artist', artist);jQuery('#simulate-sec a').attr('title', title);};};"));
(document.body || document.head || document.documentElement).appendChild(script);
});