Meteor.methods({
    pushSong: function(song) {
        if(this.userId) {
            song.owner = this.userId;
            delete song.url;
            return MusicCollection.insert(song);
        }
    },
    clear: function() {
        return MusicCollection.remove({ owner: this.userId });
    }
});
