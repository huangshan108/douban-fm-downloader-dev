jQuery("#simulate-sec").prepend('<a href="#" download="song.mp3" style="position: relative; left: 240px; background:none"><button id="download" style="margin:0; width:100px; height:26px;background:none;border:1.5px solid #9DD6C5;outline:none; color:#65C39E;" id="download">下载这首歌</button></a>');
jQuery("#download").mouseover(function() {
	jQuery("#download").css({"background-color":"#9DD6C5", "color":"white", "-o-transition":".2s", "-ms-transition":".2s","-moz-transition":".2s","-webkit-transition":".2s","transition":".2s"});
});
jQuery("#download").mouseout(function() {
	jQuery('#download').css({"background-color":"transparent", "color":"#65C39E","-o-transition":".2s", "-ms-transition":".2s","-moz-transition":".2s","-webkit-transition":".2s","transition":".2s"});
});
jQuery(document).ready(function() {
    var script = document.createElement("script");
script.appendChild(document.createTextNode("window.extStatusHandler = function(a) {var o = jQuery.parseJSON(a);console.log(o.song.url);jQuery('#simulate-sec a').attr('href', o.song.url);jQuery('#simulate-sec a').attr('download', o.song.title);};"));
(document.body || document.head || document.documentElement).appendChild(script);
});

// jQuery('#download a').attr('href', o.song.url);

// 211.147.4.32 www.douban.com
// 8.37.234.12 mr3.douban.com
// 27.195.145.196 mr4.douban.com