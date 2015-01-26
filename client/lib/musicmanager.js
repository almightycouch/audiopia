MusicManager = {
    localCollection: new Ground.Collection('music', { connection: null }),
    localStorage: null,

    addSongs: function(files, errorCallback) {
        var self = this;
        async.eachSeries(files, function(file, asyncCallback) {
            var path = file.webkitRelativePath;
            var meta = musicmetadata(file, { duration: true });
            meta.on('metadata', function(result) {
                var song = {
                    'track': result.track.no,
                    'title': result.title,
                    'album': result.album,
                    'artist': result.artist[0],
                    'genre': result.genre[0],
                    'year': result.year,
                    'duration': result.duration
                };
                self.localStorage.writeFile('{artist}/{album}/{track} {title}.{extension}'.format(
                    _.extend(song, {
                        extension: path.substr(path.lastIndexOf('.') + 1)
                    })), file, function(entry) {
                    var id = self.localCollection.insert(_.extend(song, {
                        url: entry.toURL()
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
        }, function(error) {
            if(error) {
                errorCallback(error);
            }
        });
    },
    pushSong: function(song, successCallback, errorCallback) {
        var self = this;
        Meteor.call('pushSong', song, function(error, songId) {
            if(!error) {
                if(successCallback) {
                    successCallback(_.extend(song, { '_id': songId }));
                }
            } else if(errorCallback) {
                errorCallback(error);
            }
        });
    },
    synchronize: function(errorCallback) {
        var self = this;
        _.each(self.localCollection.find().fetch(), function(song) {
            self.pushSong(song, null, errorCallback);
        });
    }
}
