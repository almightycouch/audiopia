MusicManager = {
    storage: new PersistentStorage(),
    collection: new Ground.Collection('music', { connection: null }),

    addSongs: function(files, errorCallback) {
        var self = this;
        async.eachSeries(files, function(file, asyncCallback) {
            var path = file.webkitRelativePath;
            var meta = musicmetadata(file);
            meta.on('metadata', function(result) {
                var song = {
                    'track': result.track.no,
                    'title': result.title,
                    'album': result.album,
                    'artist': result.artist[0],
                    'genre': result.genre[0],
                    'year': result.year,
                };
                self.storage.writeFile('{artist}/{album}/{track} {title}.{extension}'.format(
                    _.extend(song, {
                        extension: path.substr(path.lastIndexOf('.') + 1)
                    })), file, function(entry) {
                    self.collection.insert(_.extend(song, {
                        url: entry.toURL()
                    }));
                    asyncCallback();
                },  asyncCallback);
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
    }
};
