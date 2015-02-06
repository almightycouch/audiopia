P2P = {
    peer: null,
    requestSong: function(peerId, songId, successCallback, errorCallback, options) {
        var self = this;
        var conn = self.peer.request(peerId, songId, successCallback, errorCallback, options);
        if(!conn) {
        } else {
            conn.on('error', function(error) {
                errorCallback(error);
            });
        }
    }
};
