MusicManager = {
    peer: null,
    sharedCollection: null,
    localStorage: null,
    localCollection: null,

    initialize: function() {
        var self = this;
        try {
            self.localStorage = new FilesystemStorage();
        } catch(error) {
            try {
                self.localStorage = new IndexedDBStorage();
            } catch(error) {
                self.localStorage = new TemporaryStorage();
                self.localCollection = new Mongo.Collection(null);
            }
        }
        if(!self.sharedCollection) {
            self.sharedCollection = Music;
        }
        if(!self.localCollection) {
            self.localCollection = new Ground.Collection('music', { connection: null });
        }

        Tracker.autorun(function() {
            var userId = Meteor.userId();
            if(!userId) {
                Meteor.loginVisitor();
            }
            if(!self.peer) {
                self.peer = new WebRTC(userId, { key: '62is9f6ozx2mx6r' });
                self.synchronize(function(error) {
                    console.warn(error);
                });
            }
        });

    },
    addSongs: function(files, successCallback, errorCallback) {
        var self = this;
        Session.set('currentImport', {});
        async.eachSeries(files, function(file, asyncCallback) {
            var currentImport = Session.get('currentImport');
            if(!currentImport.abort) {
                var path = file.webkitRelativePath || file.name;
                var meta = musicmetadata(file, { duration: true });
                meta.on('metadata', function(result) {
                    var song = {
                        'track': result.track.no,
                        'title': result.title,
                        'album': result.album,
                        'artist': result.artist[0],
                        'genre': result.genre[0],
                        'year': result.year,
                        'duration': result.duration,
                        'mime': file.type,
                    };
                    self.localStorage.writeFile('{artist}/{album}/{track} {title}.{extension}'.format(
                        _.extend(song, {
                            extension: path.substr(path.lastIndexOf('.') + 1)
                        })), file, function(url) {
                        var id = self.localCollection.insert(_.extend(song, {
                            url: url
                        }));
                        self.pushSong(_.extend(song, { _id: id }));
                        asyncCallback();
                    },  function(error) {
                        if(error.name != 'InvalidModificationError') {
                            asyncCallback(error);
                        } else {
                            asyncCallback();
                        }
                    });
                }).on('done', function(error) {
                    if(error) {
                        asyncCallback();
                    }
                });
            } else {
                asyncCallback(new Error('Operation aborted.'));
            }
        }, function(error) {
            if(error) {
                errorCallback(error);
            } else {
                successCallback();
            }
            Session.set('currentImport');
        });
    },
    pushSong: function(song, successCallback, errorCallback) {
        var self = this;
        if(window.chrome && window.navigator.vendor == 'Google Inc.' && parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) >= 30) {
            Meteor.call('addSong', song, function(error, songId) {
                if(!error) {
                    if(successCallback) {
                        successCallback(_.extend(song, { '_id': songId }));
                    }
                } else if(errorCallback) {
                    errorCallback(error);
                }
            });
        }
    },
    requestSong: function(peerId, songId, successCallback, errorCallback, options) {
        var self = this;
        var conn = self.peer.request(peerId, songId, successCallback, errorCallback, options);
        if(!conn) {
        } else {
            conn.on('error', function(error) {
                errorCallback(error);
            });
        }
    },
    synchronize: function(errorCallback) {
        var self = this;
        _.each(self.localCollection.find().fetch(), function(song) {
            self.pushSong(song, null, errorCallback);
        });
    },
    clear : function(successCallback, errorCallback) {
        var self = this;
        Meteor.call('clear', function(error, total) {
            if(!error) {
                self.localCollection.remove({});
                self.localStorage.clear(function() {
                    successCallback();
                }, errorCallback);
            } else {
                errorCallback(error);
            }
        });
    }
}
