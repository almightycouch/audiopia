WebRTC = function(userId, options) {
    var self = this;
    self.peer = new Peer(userId, options);
    self.peer.on('connection', function(conn) {
        var song = MusicManager.localCollection.findOne({ _id: conn.metadata.id });
        if(!song) {
        } else {
            MusicManager.localStorage.readFileFromUrl(song.url, function(fileEntry) {
                var reader = new FileReader();
                reader.onloadend = (function(e) {
                    var context = new AudioContext();
                    context.decodeAudioData(e.target.result, function(buffer) {
                        var remote = context.createMediaStreamDestination();
                        var source = context.createBufferSource();
                        source.buffer = buffer;
                        source.start(0);
                        source.connect(remote);
                        self.peer.call(conn.peer, remote.stream, { metadata: { id: song._id } });
                    });
                });
                fileEntry.file(function(file) {
                    reader.readAsArrayBuffer(file);
                });
            });
        }
    }).on('call', function(call) {
        var index = self._whiteList.indexOf(call.metadata.id);
        if(~index) {
            call.answer(null);
            call.on('stream', function(stream) {
                AudioPlayer.loadFromUrl(URL.createObjectURL(stream));
            });
            self._whiteList.splice(index, 1);
        }
    }).on('error', function(error) {
        console.error(error);
    });
    self._whiteList = [];
}

WebRTC.prototype.connect = function(peerId, mediaId) {
    var self = this;
    self._whiteList.push(mediaId);
    return self.peer.connect(peerId, { metadata: { id: mediaId } });
}
