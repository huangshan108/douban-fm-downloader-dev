(function () {
  var hacker = {};
  hacker.hackDouban = function () {
    if ($('#fm-player').length > 0) {
      var jsUrl = 'http://katy.sinaapp.com/js/doubanfm_hacker.js?_v=2012071701';
      hacker.initHackerContainer(true);
      var script = document.createElement('script');
      script.setAttribute('src', jsUrl);
      $('body').append(script);
      //$('body').attr('onload', '$(\'body\').append(\'<script type=\\\'text/javascript\\\' src=\\\'' + jsUrl + '\\\'></script>\');');
      setInterval(hacker.uploadSongInfo, 1000);
    } else {
      if ($('a[id^=song-]').size() > 0) {
        hacker.initHackerContainer(false);
        var sids = [];
        $('a[id^=song-]').each(function (index, value) {
          sids.push($(value).attr('id').replace('song-', ''));
        });

        chrome.extension.sendMessage({
          action: 'gets',
          sids: sids
        }, function (res) {
          var songs = res.songs;
          if (songs && songs.length) {
            $.each(songs, function (index, song) {
              hacker.insertSong(song);
            });

            if (location.host == 'douban.fm') {
              hacker.getSongInfos(songs);
            }
          }
        });
      } else {
        if ($('.action').size() > 0) {
          hacker.initHackerContainer(false);

          var sids = [];
          $('.action').each(function (index, value) {
            var sid = $(value).attr('sid');
            if ( !! sid) {
              sids.push(sid);
            }
          });

          chrome.extension.sendMessage({
            action: 'gets',
            sids: sids
          }, function (res) {
            var songs = res.songs;
            if (songs && songs.length) {
              $.each(songs, function (index, song) {
                hacker.insertSong(song);
              });

              if (location.host == 'douban.fm') {
                hacker.getSongInfos(songs);
              }
            }
          });
        }
      }
    }
  }

  hacker.initHackerContainer = function (hasPlayer) {
    $('body').append('<div id="hackerContainer"></div>');
    if (hasPlayer) {
      //hacker.initHackedPlayer();
    }
		
    hacker.initHackedFunction();
		hacker.initDBLinkerCtn();
    $('#hackerContainer').append('<div id="hackedPlaylist"></div>');
    $('#hackedPlaylist').append('<ul class="songinfos" id="songinfos"></ul>');
    hacker.initHackedPanel();
    hacker.addImageResouse();
    hacker.addSongURLQRCodeImage();
  }

	hacker.initDBLinkerCtn = function() {
		$('<form target="_blank" action="http://dbfmdb.sinaapp.com/search.php" ><input type="hidden"  name="type" value="1" /><input type="text" class="input-medium"  name="keyword" placeholder="请输入歌名"/><input class="btn" type="submit" value="搜索"><div style="clear:both;"></div></form>').appendTo($('#hackerContainer'));;
	}

  hacker.initHackedFunction = function () {
    if ($('#fm-user').text() != '') {
      var func = $('<div id="hackedFunction"></div>').appendTo($("#hackerContainer"));
      /*
      if($('#radioplayer')[0]){
        $('<a href="javascript:void(0);">红心兆赫</a>').appendTo(func).click(function () {
          hacker.radioAct('switch',-3);
        });
      }
      */
      $('<a href="javascript:void(0);">红心歌曲</a>').appendTo(func).click(function () {
        hacker.redPlayList.init();
      });
    }
  }

  hacker.radioAct = function (cmd,arg){var radio=document.getElementById("radioplayer");if(radio!==undefined||radio.act!==undefined){radio.act.apply(radio,arguments)}};

  hacker.getSongInfos = function (songs) {
    if (songs && songs.length) {
      hacker.songarray = [];
      hacker.song_info_list = songs;
      hacker.getDownloadUrls();
    }
  }

  hacker.getDownloadUrls = function () {
		if(hacker.song_info_list.length){
			var song = hacker.song_info_list.pop();
	    hacker.set_cookie({
	      'start': song.sid + 'g' + song.ssid + 'g0'
	    }, 10 * 1000);

	    $.getJSON('http://douban.fm/j/mine/playlist?type=n&h=&channel=0&from=mainsite&r=4941e23d79', function (songs) {
	      //console.log(songs.song[0].url+','+songs.song[0].title);
	      //下载功能
	      var s = songs.song[0];
	      var d = $('<a href="' + s.url + '" class="saveBtn"  target="_blank" title="右键另存为"><img src="' + $('#downloadImage').attr('src') + '"/></a>').mouseover(s.url, hacker.qrcodeGenerate).mouseout(function () {
	        $('#songURLQRCodeImage').hide();
	      });
	      $('.songinfo[sid="' + s.sid + '"] .sinaBtn ').before(d);
	      s.picture = song.picture;
	      hacker.songarray.push(s);
				hacker.getDownloadUrls();
	    });
		}else{
			var downloadtext = '#注意：本脚本可在Unix/Linux下使用，依赖wget和python-mutagen，如果在播放器中音乐标签信息出现乱码，请参照 http://bit.ly/pwkA3O \n';
			for (var i = 0, l = hacker.songarray.length, song; i < l; ++i) {
        var song = hacker.songarray[i];
        downloadtext += 'mkdir "' + song.albumtitle + '" \n';
        downloadtext += 'wget -O "' + song.albumtitle + '/cover.jpg" ' + song.picture.replace('mpic', 'lpic') + ' & \n';
        downloadtext += 'wget -O "' + song.albumtitle + '/' + song.title + '.mp3" ' + song.url + ' \n';
        downloadtext += 'mid3v2 -t "' + song.title + '" -A "' + song.albumtitle + '" -a "' + song.artist + '" -y "' + song.public_time + '" "' + song.albumtitle + '/' + song.title + '.mp3" \n';
      }
			
			var uriContent = "data:text/plain;charset=utf-8," + encodeURIComponent(downloadtext);
			
			$('<a href="'+uriContent+'" download="download.sh">本页下载脚本</a>').appendTo($('#hackedFunction'));
		}
  }

  hacker.uploadSongInfo = function () {
    var songinfo = $('#songinfos .songinfo .songinfojson').get(0);
    if (typeof (songinfo) != 'undefined') {
      var song = $.parseJSON($(songinfo).text());
      chrome.extension.sendMessage({
        action: 'save',
        song: song
      }, function (response) {
        console.log(response.result);
      });
      $(songinfo).remove();
    }
  }

  hacker.initHackedPanel = function () {
    $('#hackerContainer').append('<div id="hackedPanel"></div>');
    $('#hackedPanel').append('<span>收起</span><img src="' + chrome.extension.getURL('image/panel-arrow.png') + '" />');
    $('#hackedPanel').toggle(function () {
      if (typeof ($('#hackedPlaylist').attr('originalHeight')) == 'undefined') {
        $('#hackedPlaylist').attr('originalHeight', $('#hackedPlaylist').height());
      }
      $('#hackedPlaylist').animate({
        height: 0
      }, 'slow');
      $('#hackedPanel span').first().html('展开');
    }, function () {
      $('#hackedPlaylist').animate({
        height: $('#hackedPlaylist').attr('originalHeight')
      }, 'slow');
      $('#hackedPanel span').first().html('收起');
    });
  }

  hacker.initHackedPlayer = function () {
    var playImg = chrome.extension.getURL('image/playback_play.jpg');
    var nextImg = chrome.extension.getURL('image/playback_next.jpg');
    var pauseImg = chrome.extension.getURL('image/playback_pause.jpg');
    $("#hackerContainer").append('<div id="hackedPlayer"><img src="' + playImg + '" id="playButton" /><img src="' + pauseImg + '" id="pauseButton" /><div id="playingSong"><div><span id="playingSongTitle" >&nbsp;</span></div><div class="dashLine">&nbsp;</div><div><a href="#"  id="playingSongAlbum" target="_blank">&nbsp;</a></div></div><img src="' + nextImg + '" id="nextButton" /><audio src="" controls="controls"></audio><div class="clear"></div></div>');
  }

  hacker.addImageResouse = function () {
    var imageResources = $('<div id="imageResources"></div>');
    var downloadImage = chrome.extension.getURL('image/download.png');
    var qrcodeImage = chrome.extension.getURL('image/qrcode.png');
    var likeImage = chrome.extension.getURL('image/gray-heart.gif');
    var likedImage = chrome.extension.getURL('image/red-heart.gif');
    var banImage = chrome.extension.getURL('image/ban.gif');
    $(imageResources).append('<img src="' + downloadImage + '" id="downloadImage"/>').append('<img src="' + qrcodeImage + '" id="qrcodeImage"/>').append('<img src="' + likeImage + '" id="likeImage"/>').append('<img src="' + likedImage + '" id="likedImage"/>').append('<img src="' + banImage + '" id="banImage"/>').appendTo($('body'));
  }

  hacker.addSongURLQRCodeImage = function () {
    $('body').append('<img src="" id="songURLQRCodeImage" />');
  }

  hacker.set_cookie = function (dict, time) {
    var date = new Date();
    date.setTime(date.getTime() + time);
    var expires = "; expires=" + date.toGMTString();
    for (var i in dict) {
      document.cookie = i + "=" + dict[i] + expires + "; domain=douban.fm; path=/"
    }
  };
  hacker.get_cookie = function (name) {
    var nameEQ = name + "=",
      c, ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length).replace(/\"/g, "")
      }
    }
    return null
  };

  hacker.insertSong = function (s) {
    var songinfo = $('<li class="songinfo" sid="' + s.sid + '" ></li>');
    //专辑图片
    var cover = $('<div class="cover"></div>').append($('<img src="' + s.picture + '" />'));
    //歌名
    var url = 'http://douban.fm/?start=' + s.sid + 'g' + s.ssid + 'g0&cid=0';
    var title = $('<li><a href="' + url + '" target="_blank">' + s.title + '</a></li>').mouseover(hacker.scrollMouseover);
    //歌手
    var artist = $('<li>' + s.artist + '</li>');
    //专辑信息
    var album = $('<li><a href="http://www.douban.com' + s.album + '" target="_blank">' + s.albumtitle + '</a></li>').mouseover(hacker.scrollMouseover);
    //功能
    var functions = $('<li></li>');

    //新浪微博功能
    $('<a href="#" class="sinaBtn" title="转播到新浪微博"><img src="http://www.sinaimg.cn/blog/developer/wiki/16x16.png" border="0" /></a>').click(function (event) {
      hacker.sinaWeibo(s);
      return false;
    }).appendTo(functions);
    //腾讯微博功能
    $('<a href="#" class="tencentBtn" title="转播到腾讯微博"><img src="http://v.t.qq.com/share/images/s/weiboicon16.png" border="0" /></a>').click(function (event) {
      hacker.tencentWeibo(s);
      return false;
    }).appendTo(functions);
    //待上传的歌曲信息标签和封面
    //songinfo.append('<span class="songinfojson">'+JSON.stringify(s)+'</span>')
    songinfo.append(cover);
    $('<ul></ul>').append(title).append(artist).append(album).append(functions).appendTo(songinfo);
    songinfo.append('<div class="clear"/>').appendTo($('#songinfos'));
    $('#hackedPlaylist').scrollTop(10000);
  }
  //QRCode图片生成
  hacker.qrcodeGenerate = function (event) {
    var x = event.pageX - 210;
    var y = event.pageY - 210;
    var url = 'http://qrcode.kaywa.com/img.php?s=8&d=' + encodeURIComponent(event.data);
    $('#songURLQRCodeImage').attr('src', url);
    $('#songURLQRCodeImage').css({
      'left': x + 'px',
      'top': y + 'px'
    });
    $('#songURLQRCodeImage').fadeIn('slow');
  }
  //内容过长之后的滚动显示动画
  hacker.scrollMouseover = function (event) {
    $(this).unbind('mouseover');
    var container = $(this);
    var child = $(this).children().get(0);
    if ($(child).width() > $(container).width()) {
      $(child).animate({
        marginLeft: $(container).width() - $(child).width()
      }, ($(child).width() - $(container).width()) * 20, function () {
        $(this).animate({
          marginLeft: 0
        }, ($(this).width() - $(this).parent().width()) * 20, function () {
          $(this).parent().mouseover(hacker.scrollMouseover);
        });
      });
    } else {
      $(this).mouseover(hacker.scrollMouseover);
    }
  }
  //新浪微博分享
  hacker.sinaWeibo = function (s) {
    var _t = encodeURIComponent('我正在收听 ' + s.artist + ' 的 《' + s.title + '》 (来自#豆瓣FM-Hacker#) ');
    var _url = encodeURIComponent('http://douban.fm/?start=' + s.sid + 'g' + s.ssid + 'g0&cid=0');
    var _pic = encodeURI(s.picture);
    var _appkey = encodeURI('3092420153');
    var _u = 'http://service.weibo.com/share/share.php?url=' + _url + '&title=' + _t + '&pic=' + _pic + '&appkey=' + _appkey;
    window.open(_u, '', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
  }
  //腾讯微博分享
  hacker.tencentWeibo = function (s) {
    var _t = encodeURIComponent('我正在收听 ' + s.artist + ' 的 《' + s.title + '》 (来自#豆瓣FM-Hacker#) ');
    var _url = encodeURIComponent('http://douban.fm/?start=' + s.sid + 'g' + s.ssid + 'g0&cid=0');
    var _appkey = encodeURI("39ef552d94a9488f9e1bb39bf91fc1a8");
    //你从腾讯获得的appkey
    var _pic = encodeURI(s.picture);
    //（例如：var _pic='图片url1|图片url2|图片url3....）
    var _site = '';
    //你的网站地址
    var _u = 'http://v.t.qq.com/share/share.php?url=' + _url + '&appkey=' + _appkey + '&site=' + _site + '&pic=' + _pic + '&title=' + _t;
    window.open(_u, '', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
  }

  hacker.redPlayList = (function () {
    var bind = function (func, ctx) {
        var args = Array.prototype.slice.call(arguments, 0);
        return function () {
          return func.apply(ctx, args.slice(2).concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
    var player = (function () {
      var p = {
        template: '<div class="fmbox"><div class="side"><img src="" width="200" height="200" id="_cover" /></div><div class="main"><div class="pause"><span type="_pause"></span></div><div class="monbox"><h2 id="_artist"></h2><p id="_album"></p><dl class="music"><dt><a href="#" title="" id="_title" target="_blank"></a></dt><dd class="bar"><p id="_progress"> &nbsp; </p></dd><dd class="volume"><div><b id="_time"></b><span id="_mute"></span><a id="_volumeBtn" href="javascript:void(0);"><em id="_volume">&nbsp;</em></a></div></dd></dl><div class="ico"><span class="ico_1" id="_red"></span><span class="ico_2" id="_ban"></span><span class="ico_3" id="_next"></span></div></div></div><div class="pauseOver" id="_pauseOver" type="_pause">点击播放</div><audio controls="controls" autoplay="autoplay" style="display:none"></audio></div>',
        musicSite: 'http://music.douban.com',
        playing: false,
        volume: 1,
        ismute: 0,
        defaultCover: ''
      };
      p.init = function (options) {
        $.extend(this, options);
        this.region = $(this.template).appendTo(this.container);
        this._initField();
        this._setBackground();
        this._render();
        this._renderAuth();
        this._initEvent();
        if (this.autoPlay) {
          this.play();
        }
        return this;
      };
      p._initField = function () {
        this.title = $('#_title', this.region);
        this.artist = $('#_artist', this.region);
        this.cover = $('#_cover', this.region);
        this.album = $('#_album', this.region);
        this.volumeBar = $('#_volume', this.region);
        this.volumeBtn = $('#_volumeBtn', this.region);
        this.muteBtn = $('#_mute', this.region);
        this.time = $('#_time', this.region);
        this.progress = $('#_progress', this.region);
        this.pauseBtn = $(':[type="_pause"]', this.region);
        this.pauseOver = $('#_pauseOver', this.region);
        this.redBtn = $('#_red', this.region);
        this.redBtn.hide();
        this.ban = $('#_ban', this.region);
        this.ban.hide();
        this.nextBtn = $('#_next', this.region);
        this.player = $('audio', this.region);
        if (!this.getNextSong) {
          this.nextBtn.hide();
        }

      };
      p._setBackground = function () {
        $('.pause span', this.region).css('background', 'url(' + chrome.extension.getURL('image/stop.gif') + ')');
        $('.ico_1, .ico_2, .ico_3', this.region).css('background', 'url(' + chrome.extension.getURL('image/ico.gif') + ') no-repeat');
        this.muteBtn.css('background', 'url(' + chrome.extension.getURL('image/volume.gif') + ') no-repeat');
        this.redBtn.css('background-position', '0 0');
        this.ban.css('background-position', '-27px 0');
        this.nextBtn.css('background-position', '-55px 0');
      };
      p._renderAuth = function () {
        this.artist.html('@anhulife');
        this.album.html(['&lt;&nbsp;', '豆瓣FM-Hacker', '&nbsp;&gt;&nbsp;'].join(''));
        this.title.html('豆瓣FM-Hacker');
        this.title.attr('href', 'http://dbfmdb.sinaapp.com');
        this.title.attr('title', '豆瓣FM-Hacker');
        this.cover.attr('src', chrome.extension.getURL('image/icon128.png'));
      };
      p._initEvent = function () {
        this.pauseBtn.toggle(bind(this.pause, this), bind(this.pause, this));
        this.redBtn.toggle(bind(this.red, this), this.red);
        this.nextBtn.click(bind(this.next, this));
        this.volumeBtn.click(bind(this.setVolume, this));
        this.muteBtn.click(bind(this.mute, this));
        this.player.bind('play', bind(this.progressRender, this));
        this.player.bind('ended', bind(this.next, this));
      };
      p.play = function (song) {
        this._getUrl(song, bind(function (song) {
          this.song = song;
          this.player.attr('src', this.song.url);
          this.player[0].play();
          this.stoped = false;
          this._render();
        }, this));
      };
      p._set_cookie = function (dict, days) {
        var date = new Date();
        days = days || 30;
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        for (var i in dict) {
          document.cookie = i + "=" + dict[i] + expires + "; domain=douban.fm; path=/"
        }
      };
      p._getUrl = function (song, callback) {
        this._set_cookie({
          'start': song.sid + 'g' + song.ssid + 'g0'
        }, (1 / 24 / 60 / 10));
        $.getJSON('http://douban.fm/j/mine/playlist?type=n&h=&channel=0&from=mainsite&r=4941e23d79', function (songs) {
          var s = songs.song[0];
          callback && callback(s);
        });
      };
      p.stop = function () {
        this.player[0].pause();
        this.stoped = true;
        this.song = null;
        this._render();
      };
      p.pause = function () {
        if (this.song && this.song.url) {
          if (!this.player[0].paused) {
            this.player[0].pause();
            this.pauseOver.show();
          } else {
            if (!this.player.attr('src')) {
              this.player.attr('src', this.song.url);
            }
            this.player[0].play();
            this.pauseOver.hide();
          }
        }
      };
      p._render = function () {
        this.volumeBar.css('width', (this.volume * 100) + '%');
        this.time.html('00:00');
        this.progress.css('width', '0%');
        this.pauseOver.hide();
        if (this.song) {
          this.artist.html(this.song.artist);
          this.album.html(['&lt;&nbsp;', this.song.albumtitle, '&nbsp;&gt;&nbsp;', this.song.pubtime].join(''));
          this.title.html(this.song.title);
          this.title.attr('href', this.musicSite + this.song.album);
          this.title.attr('title', this.song.title);
          this.cover.attr('src', this.song.picture.replace('mpic', 'lpic'));
        } else {
          this.artist.html('');
          this.album.html('');
          this.title.html('');
          this.title.attr('href', '');
          this.title.attr('title', '');
          this.cover.attr('src', this.defaultCover);
        }
      };
      p.progressRender = function () {
        if (!this.player[0].paused && this.player[0].duration) {
          this.remain = this.player[0].duration - this.player[0].currentTime;
          var r = Math.floor(this.remain / 60) + ':' + ((this.remain / 60 - Math.floor(this.remain / 60)) * 0.6).toFixed(2).substr(2);
          var p = (this.player[0].currentTime * 100 / this.player[0].duration).toFixed(2);
          this.progress.css('width', p + '%');
          this.time.html('-' + r);
        }
        if (this.stoped) {
          this.time.html('00:00');
          this.progress.css('width', '0%');
        } else {
          this.timeout = setTimeout(bind(this.progressRender, this), 1000);
        }
      };
      p.setVolume = function (e) {
        this.volume = e.offsetX / this.volumeBtn.width();
        this.volumeBar.css('width', (this.volume * 100) + '%');
        this.player[0].volume = this.volume;
      };
      p.red = function () {};
      p.next = function () {
        if (this.getNextSong) {
          this.getNextSong();
        } else {
          this.stop();
        }
      };
      p.mute = function () {
        if (this.ismute) {
          this.ismute = 0;
          this.volumeBar.css('width', (this.volume * 100) + '%');
          this.player[0].volume = this.volume;
        } else {
          this.ismute = 1;
          this.volumeBar.css('width', 0 + '%');
          this.player[0].volume = 0;
        }
      };
      p.destroy = function () {};
      return p;
    })();

    var playlist = (function () {
      var templ = function (temp, obj) {
          var str = temp;
          for (var o in obj) {
            str = str.replace('#{' + o + '}', obj[o]);
          }
          return str;
        };
      var pl = {
        songs: [],
        template: '<div class="plctn"><div type="_player"></div><ul class="_pl" type="_playlist"></ul><span type="_getmore" class="more">获取更多</span></div>',
        songTemplate: '<li sid="#{sid}" title="双击播放">#{title}--#{artist}</li>'
      };
      pl.init = function (options) {
        $.extend(this, options);
        this.songs = this.songs ? this.songs : [];
        this.region = $(this.template).appendTo(this.container);
        this._initField();
        this._initEvent();
        if (this.autoPlay) {
          this.play();
        }
        return this;
      };
      pl.getNextSong = function () {
        var curr;
        if (this.random) {
          var others = this.plRegion.find(':not[.on]');
          var len = others.length;
          curr = others[parseInt(Math.random() * len)];
        } else {
          curr = this.plRegion.find('.on');
          if (curr) {
            curr = curr.next('li');
          }
        }
        var sid;
        if (curr && (sid = curr.attr('sid'))) {
          this.playSid(sid, curr);
        }
      };
      pl._initField = function () {
        this.plRegion = this.region.find('ul[type="_playlist"]');

        this.player = player.init({
          container: this.region.find('div[type="_player"]'),
          autoPlay: false,
          getNextSong: bind(this.getNextSong, this)
        });

        if (this.songs && this.songs.length > 0) {
          var hs = [];
          $.each(this.songs, bind(function (i, song) {
            hs.push(templ(this.songTemplate, song));
          }, this));
          $(hs.join('')).appendTo(this.plRegion);
        } else {
          if (this.getMoreSongs) {
            this.getMoreSongs(bind(this._render, this));
          }
        }

        this.moreBtn = this.region.find('span[type="_getmore"]');

      };
      pl._initEvent = function () {
        this.plRegion.dblclick(bind(this._dbclick, this));
        this.moreBtn.click(bind(this._moreclick, this));
      };
      pl._moreclick = function () {
        if (!this._morelock && this.getMoreSongs) {
          this._morelock = true;
          this.moreBtn.html('加载中...');
          this.getMoreSongs(bind(function (songs) {
            this._morelock = false;
            this.moreBtn.html('获取更多');
            this._render(songs)
          }, this));
        }
      };
      pl._dbclick = function (e) {
        var el = $(event.target);
        var sid;
        var song;
        if ((sid = el.attr('sid'))) {
          this.playSid(sid, el);
        }
        e.preventDefault();
      };
      pl._render = function (songs) {
        if (songs) {
          var hs = [];
          $.each(songs, bind(function (i, song) {
            if (song.sid) {
              hs.push(templ(this.songTemplate, song));
            }
          }, this));

          $(hs.join('')).appendTo(this.plRegion);
          this.songs = this.songs.concat(songs);
        }
      };
      pl.playSid = function (sid, el) {
        if (sid) {
          for (var i = 0, l = this.songs.length, s; i < l; ++i) {
            s = this.songs[i];
            if (s.sid == sid) {
              song = s;
              break;
            }
          }

          this.plRegion.find('.on').removeClass('on');
          el && el.addClass('on');
          if (song) {
            this.play(song);
          }
        }
      };
      pl.play = function (song) {
        if (!song) {
          song = this.songs[0];
          this.plRegion.find('li').first().addClass('on');
        }
        this.player.play(song);
      };
      pl.destroy = function () {};
      return pl;
    })();

    var redPlayList = (function () {
      var rpl = {};
      rpl.init = function () {
        this.page = 0;

        var hh = '<div id="video_modal" class="modal fade" style="display: none; width: 495px;position: fixed;top: 50%;background-color: white;left: 50%;height: 510px;"><div class="modal-header"><a href="#" class="close">×</a><h3><a href="http://douban.fm/mine?type=liked" target="_blank">红心页面</a></h3></div><div class="modal-body" style="text-align:center">加载中,请稍候</div><div class="modal-footer"></div></div>'
        hh = $(hh).appendTo($('body')).modal({
          closeOnEscape: true,
          show: true,
          backdrop: 'static'
        })
        this._cancel = false;
        $('#video_modal').bind('hidden', bind(function () {
          $('#video_modal').remove();
          this._cancel = true;
        }, this));

        this.getSids(this.page, bind(function (songs) {
          if (this._cancel) {
            return;
          }
          this.playlist = playlist.init({
            container: hh.find('.modal-body').empty(),
            songs: songs,
            getMoreSongs: bind(function (callback) {
              this.page += 1;
              this.getSids(this.page, callback);
            }, this),
            autoPlay: true
          });
        }, this));
      };
      rpl.getSids = function (page, callback) {
        var url;
        if (page) {
          url = 'http://douban.fm/mine?start=' + page * 15 + '&type=liked';
        } else {
          url = 'http://douban.fm/mine?type=liked';
        }

        $.get(url, bind(function (h) {
					if (this._cancel) {
            return;
          }
          var _sids = h.match(/sid=["'](\d*)["']/gi);
          var sids = []
          $.each(_sids, function (i, e) {
            sids.push(e.match(/sid=["'](\d*)["']/)[1]);
          });
          this.getSongs(sids, callback);
        }, this));
      };
      rpl.getSongs = function (sids, callback) {
				chrome.extension.sendMessage({
          action: 'gets',
          sids: sids
        }, function (res) {
          var songs = res.songs;
          callback && callback(songs);
        });
      };
      return rpl;
    })()

    return redPlayList;
  })();

  $("body").ready(hacker.hackDouban);
})();