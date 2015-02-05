Template.Cover.helpers({
    coverUrl: function() {
        var song = Session.get('currentSong');
        if(!song) {
            return '/static/img/cover.png';
        } else {
            var request = new XMLHttpRequest();
            request.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key={key}&artist={artist}&album={album}&format=json'.format({
                artist: song.artist,
                album: song.album,
                key: 'd3e32fae7e888bac6ba385afaef043bf',
            }), false);
            request.send(null);
            var response = JSON.parse(request.responseText);
            return response.album.image[4]['#text'];
        }
    }
});
