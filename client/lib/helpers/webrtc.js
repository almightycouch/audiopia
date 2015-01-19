WebRTC = function(userId, options) {
    var self = this;
    self.peer = new Peer(userId, options);
    self.peer.on('connection', function(conn) {
        var sendError = function(error) {
            setTimeout(function() {
                conn.send({ error: error });
            }, 500);
        };
        var song = MusicManager.localCollection.findOne({ _id: conn.metadata.id });
        if(!song) {
            sendError('Invalid request metadata.');
        } else {
            MusicManager.localStorage.readFileFromUrl(song.url, function(fileEntry) {
                var reader = new FileReader();
                reader.onloadend = (function(e) {
                    var context = self._audioContext;
                    context.decodeAudioData(e.target.result, function(buffer) {
                        var remote = context.createMediaStreamDestination();
                        var source = context.createBufferSource();
                        source.buffer = buffer;
                        source.start(0);
                        source.connect(remote);
                        var stream = self.peer.call(conn.peer, remote.stream, { metadata: { id: song._id } });
                        var checkCounter = 0;
                        var checkMediaConnection = function() {
                            if(!stream.open) {
                                setTimeout(checkMediaConnection, 200);
                                if(checkCounter < 50) {
                                    checkCounter++;
                                } else {
                                    sendError('Handshake timeout.');
                                }
                            } else {
                                conn.close();
                            }
                        };
                        checkMediaConnection();
                    }, function() {
                        sendError('Failed to decode audio file.');
                    });
                });
                reader.onerror = (function(e) {
                    sendError('Failed to read audio file.');
                });
                fileEntry.file(function(file) {
                    reader.readAsArrayBuffer(file);
                });
            }, function(error) {
                sendError('Failed to retrieve audio file.');
            });
        }
    }).on('call', function(call) {
        var index = self._whiteList.indexOf(call.metadata.id);
        if(~index) {
            call.answer(null);
            call.on('stream', function(stream) {
                AudioPlayer.loadFromUrl(URL.createObjectURL(stream), self._successCallback, self._errorCallback);
            });
            self._whiteList.splice(index, 1);
        }
    }).on('error', function(error) {
        if(self._errorCallback) {
            self._errorCallback(error);
        } else {
            console.warn(error);
        }
    });
    self._audioContext = new AudioContext();
    self._whiteList = [];
}

WebRTC.prototype.connect = function(peerId, mediaId, successCallback, errorCallback) {
    var self = this;
    self._whiteList.push(mediaId);
    conn = self.peer.connect(peerId, { metadata: { id: mediaId } });
    conn.on('open', function() {
        self._successCallback = successCallback;
        self._errorCallback = errorCallback;
        conn.on('data', function(data) {
            if(errorCallback && 'error' in data) {
                errorCallback(data.error);
                conn.close();
            }
        });
        conn.on('close', function() {
            self._successCallback = undefined;
            self._errorCallback = undefined;
        });
    });
    return conn;
}
