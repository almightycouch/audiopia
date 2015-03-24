WebRTC = function(userId, options, successCallback) {
    var self = this;
    self.peer = new Peer(userId, options);
    self.peer.on('open', function(id) {
        successCallback();
    }).on('connection', function(conn) {
        var sendError = function(error) {
            setTimeout(function() {
                conn.send({ error: error });
            }, 500);
        };
        var options = conn.metadata;
        var song = MusicManager.localCollection.findOne({ _id: options.id });
        if(!song) {
            sendError('Invalid request metadata.');
        } else {
            var successCallback = null;
            if(options.action == 'stream') {
                successCallback = function(fileEntry) {
                    var reader = new FileReader();
                    reader.onloadend = (function(event) {
                        var context = self._audioContext;
                        context.decodeAudioData(event.target.result, function(buffer) {
                            var remote = context.createMediaStreamDestination();
                            var source = context.createBufferSource();
                            source.buffer = buffer;
                            source.start();
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
                        }, function(error) {
                            sendError('Failed to decode audio file.');
                        });
                    });
                    reader.onerror = (function(e) {
                        sendError('Failed to read audio file.');
                    });
                    if(fileEntry instanceof Blob) {
                        reader.readAsArrayBuffer(fileEntry);
                    } else {
                        fileEntry.file(function(file) {
                            reader.readAsArrayBuffer(file);
                        });
                    }
                }
            } else {
                successCallback = function(fileEntry) {
                    var sendData = function(blob) {
                        setTimeout(function() {
                            conn.send({ data: blob, mime: song.mime });
                        }, 500);
                    };
                    if(_.isFunction(fileEntry.file)) {
                        fileEntry.file(sendData);
                    } else {
                        sendData(fileEntry);
                    }
                }
            }
            MusicManager.localStorage.readFileFromUrl(song.url, successCallback, function(error) {
                sendError('Failed to retrieve audio file.');
            });
        }
    }).on('call', function(call) {
        var index = self._whiteList.indexOf(call.metadata.id);
        if(~index) {
            call.answer(null);
            call.on('stream', function(stream) {
                self._successCallback(URL.createObjectURL(stream));
            });
            self._whiteList.splice(index, 1);
        }
    }).on('error', function(error) {
        if(error.type == 'network') {
            console.warn(error.message);
            console.log('will try to reconnect in 5s');
            setTimeout(function() {
                self.peer.reconnect();
            }, 5000);
        } else if(error.type == 'browser-incompatible') {
            // TODO
        } else if(self._errorCallback) {
            self._errorCallback(error);
        } else {
            console.warn(error.message);
        }
    });
    try {
        self._audioContext = new AudioContext();
    } catch(error) {
        self._audioContext = new webkitAudioContext();
    }
    self._whiteList = [];
}

WebRTC.prototype.request = function(peerId, mediaId, successCallback, errorCallback, options) {
    var self = this;
    self._whiteList.push(mediaId);
    self._successCallback = function(url) {
        if(successCallback) {
            successCallback(url);
        }
    }
    self._errorCallback = function(error) {
        if(errorCallback) {
            errorCallback(error);
        }
        self._successCallback = undefined;
        self._errorCallback = undefined;
    }
    if(!options || _.isEmpty(options)) {
        options = { action: 'stream' };
    }
    conn = self.peer.connect(peerId, { metadata: _.extend(options, { id: mediaId }), reliable: !_.isEqual(options.action, 'stream') });
    if(!conn) {
    } else {
        conn.on('open', function() {
            conn.on('chunk', function(data, n, total) {
                if('progress' in options) {
                    options.progress(data, n, total);
                }
            }).on('data', function(data) {
                if('error' in data) {
                    if(errorCallback) {
                        errorCallback(data.error);
                    }
                    conn.close();
                } else if('data' in data) {
                    var blob = new Blob([data.data], {
                        type: data.mime
                    });
                    self._successCallback(URL.createObjectURL(blob));
                }
            }).on('close', function() {
                self._successCallback = undefined;
                self._errorCallback = undefined;
            });
        });
    }
    return conn;
}
