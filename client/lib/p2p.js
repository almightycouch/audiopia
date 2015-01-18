P2P = {
    peer: null,
    requestStream: function(peerId, songId, successCallback, errorCallback) {
        var self = this;
        var conn = self.peer.connect(peerId, songId);
        if(successCallback) {
            conn.on('open', function() {
                successCallback();
            });
        }
        if(errorCallback) {
            conn.on('error', function(error) {
                errorCallback(error);
            });
        }
    }
};
