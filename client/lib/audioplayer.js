AudioPlayer = {
    audioElement: new Audio(),

    canPlay: function(song) {
        var self = this;
        return self.audioElement.canPlayType(song.mime);
    },
    load: function(song, successCallback, errorCallback, options) {
        var self = this;
        if(self.audioElement.currentSrc) {
            self.audioElement.pause();
            Session.set('currentSong', undefined);
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
        if(_.contains(song.owners, Meteor.userId())) {
            self.loadFromUrl(MusicManager.localCollection.findOne({ _id: song._id }).url, successCallback2, errorCallback2);
        } else if(song.url) {
            self.loadFromUrl(song.url, successCallback2, errorCallback2);
        } else {
            MusicManager.requestSong(song.owners[0], song._id, function(url) {
                self.loadFromUrl(url, successCallback2, errorCallback2);
            }, errorCallback2, options);
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
