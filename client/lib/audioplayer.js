AudioPlayer = {
    audioElement: null,

    initialize: function() {
        var self = this;
        self.audioElement = new Audio();
        self.audioElement.addEventListener('canplay', function() {
            this.play();
        });
        self.audioElement.addEventListener('ended', function() {
            Session.set('currentSong', null);
        });
        return self.audioElement;
    },
    load: function(song, successCallback, errorCallback) {
        var self = this;
        if(song.url) {
            self.loadFromUrl(song.url);
        } else if(song.owner == Meteor.userId()) {
            self.loadFromUrl(MusicManager.localCollection.findOne({ _id: song._id }).url);
        } else {
            P2P.requestStream(song.owner, song._id, function() {
                Session.set('currentSong', song);
                if(successCallback) {
                    successCallback();
                }
            }, errorCallback);
            return;
        }
        Session.set('currentSong', song);
        if(successCallback) {
            successCallback();
        }
    },
    loadFromUrl: function(url) {
        var self = this;
        self.audioElement.src = url;
        self.audioElement.load();
    }
}
