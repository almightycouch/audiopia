AudioPlayer = {
    audioElement: null,

    load: function(song) {
        var self = this;
        if(!self.audioElement) {
            self.audioElement = new Audio();
            self.audioElement.addEventListener('canplay', function() {
                this.play();
            });
            self.audioElement.addEventListener('ended', function() {
            });
        }

        var url = song.url;
        if(!url) {
        }
        self.loadFromUrl(url);
    },
    loadFromUrl: function(url) {
        var self = this;
        self.audioElement.src = url;
        self.audioElement.load();
    }
}
