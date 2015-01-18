AudioPlayer = {
    audioElement: null,

    initialize: function() {
        var self = this;
        self.audioElement = new Audio();
        self.audioElement.addEventListener('canplay', function() {
            this.play();
        });
        self.audioElement.addEventListener('ended', function() {
        });
        return self.audioElement;
    },
    load: function(song) {
        var self = this;
        var url = song.url;
        if(!url) { }
        self.loadFromUrl(url);
    },
    loadFromUrl: function(url) {
        var self = this;
        self.audioElement.src = url;
        self.audioElement.load();
    }
}
