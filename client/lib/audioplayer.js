AudioPlayer = {
    audioElement: null,

    initialize: function() {
        var self = this;
        if(!self.audioElement) {
            self.audioElement = new Audio();
            self.audioElement.addEventListener('ended', function() {
                Session.set('currentSong', null);
            });
        }
        return self.audioElement;
    },
    canPlay: function(song) {
        var self = this;
        return self.audioElement.canPlayType(song.mime);
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
        var errorCallback2 = function(error) {
            if(!(error instanceof Error)) {
                error = new Error(error);
            }
            if(errorCallback) {
                errorCallback(error);
            }
        };
        if(song.url) {
            self.loadFromUrl(song.url, successCallback2, errorCallback2);
        } else if(song.owner == Meteor.userId()) {
            self.loadFromUrl(MusicManager.localCollection.findOne({ _id: song._id }).url, successCallback2, errorCallback2);
        } else {
            P2P.requestStream(song.owner, song._id, function(url) {
                self.loadFromUrl(url, successCallback2, errorCallback2);
            }, errorCallback2);
        }
    },
    loadFromUrl: function(url, successCallback, errorCallback) {
        var self = this;
        var loadCallback = function(url) {
            self.audioElement.src = url;
            self.audioElement.load();
            if(successCallback) {
                successCallback();
            }
            self.audioElement.play();
        }
        if(url.indexOf('indexeddb:') != 0) {
            loadCallback(url);
        } else {
            MusicManager.localStorage.readFileFromUrl(url, function(fileEntry) {
                loadCallback(URL.createObjectURL(fileEntry));
            }, errorCallback);
        }
    }
}
