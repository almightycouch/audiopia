Template.Cover.created = function() {
    var self = this;
    self.coverUrl = new ReactiveVar();
    Tracker.autorun(function() {
        var song = Session.get('currentSong');
        if(!song) {
            self.coverUrl.set('/static/img/cover.png');
        } else if(song.artist != self._artist || song.album != self._album) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function(event) {
                try {
                    self._artist = song.artist;
                    self._album = song.album;
                    self._url = JSON.parse(request.responseText).album.image[4]['#text'];
                    self.coverUrl.set(self._url);
                } catch(error) {
                    self.coverUrl.set('/static/img/cover.png');
                    self._artist = self._album = self._url = undefined;
                }
            }
            request.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key={key}&artist={artist}&album={album}&format=json'.format({
                artist: song.artist,
                album: song.album,
                key: 'd3e32fae7e888bac6ba385afaef043bf',
            }), true);
            request.send(null);
        } else {
            self.coverUrl.set(self._url);
        }
    });
}

Template.Cover.helpers({
    coverUrl: function() {
        var self = Template.instance();
        return self.coverUrl.get();
    }
});
