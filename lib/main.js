Meteor.methods({
    pushSong: function(song) {
        song.owner = this.userId;
        delete song.url;
        return MusicCollection.insert(song);
    }
});
