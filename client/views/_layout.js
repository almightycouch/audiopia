Template._layout.helpers({
    'onlineCount': function() {
        return MusicCollection.find().count();
    },
    'localCount': function() {
        return MusicManager.localCollection.find().count();
    }
});
