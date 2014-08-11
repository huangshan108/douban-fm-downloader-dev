chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
			if(request.action == 'save') {
				var song = request.song;
				//console.log(song);
				$.ajax({
					type : 'POST',
					url : 'http://dbfmdb.sinaapp.com/api/song.php',
					data : song,
					success : function(data, textStatus, jqXHR) {
						sendResponse({
							result : data
						});
					},
					dataType : 'json'
				});
			}
			if(request.action == 'get') {
				var sid = request.sid;
				$.getJSON('http://dbfmdb.sinaapp.com/api/song.php?sid=' + sid, function(song) {
					sendResponse({
						song : song
					});
				});
			}
			
			if(request.action == 'gets') {
				var sids = request.sids;
				$.getJSON('http://dbfmdb.sinaapp.com/api/songs.php?sids=' + sids.join('_'), function(songs) {
					sendResponse({
						songs : songs
					});
				});
			}

			return true;
		});