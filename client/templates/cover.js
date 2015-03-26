Template.Cover.created = function() {
    var self = this;
    self.artist = new ReactiveVar();
    self.album = new ReactiveVar();
    self.coverUrl = new ReactiveVar();
    self.autorun(function() {
        var song = Session.get('currentSong');
        if(!song) {
            self.coverUrl.set('/static/img/cover.png');
        } else if(song.artist != self.artist.get() || song.album != self.album.get()) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function(event) {
                try {
                    self.tmpUrl = JSON.parse(this.responseText).album.image[4]['#text'];
                } catch(error) {
                    self.tmpUrl ='/static/img/cover.png';
                }
                self.coverUrl.set(self.tmpUrl);
            }
            request.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key={key}&artist={artist}&album={album}&format=json'.format({
                artist: song.artist,
                album: song.album,
                key: 'd3e32fae7e888bac6ba385afaef043bf',
            }), true);
            request.send(null);
            self.artist.set(song.artist);
            self.album.set(song.album);
        } else {
            if(self.coverUrl.get() != self.tmpUrl) {
                self.coverUrl.set(self.tmpUrl);
            }
        }
    });
}

Template.Cover.helpers({
    'artist': function() {
        var self = Template.instance();
        return self.artist.get();
    },
    'album': function() {
        var self = Template.instance();
        return self.album.get();
    },
    'coverUrl': function() {
        var self = Template.instance();
        return self.coverUrl.get();
    }
});
