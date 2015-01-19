AudioPlayer = {
    audioElement: null,

    initialize: function() {
        var self = this;
        self.audioElement = new Audio();
        self.audioElement.addEventListener('ended', function() {
            Session.set('currentSong', null);
        });
        return self.audioElement;
    },
    load: function(song, successCallback, errorCallback) {
        var self = this;
        if(self.audioElement.currentSrc) {
            Session.set('currentSong', undefined);
            self.audioElement.src = null;
        }
        var successCallback2 = function() {
            Session.set('currentSong', song);
            if(successCallback) {
                successCallback();
            }
        };
        if(song.url) {
            self.loadFromUrl(song.url, successCallback2, errorCallback);
        } else if(song.owner == Meteor.userId()) {
            self.loadFromUrl(MusicManager.localCollection.findOne({ _id: song._id }).url, successCallback2, errorCallback);
        } else {
            P2P.requestStream(song.owner, song._id, successCallback2, errorCallback);
        }
    },
    loadFromUrl: function(url, successCallback, errorCallback) {
        var self = this;
        self.audioElement.src = url;
        self.audioElement.load();
        if(successCallback) {
            successCallback();
        }
        self.audioElement.play();
    }
}
