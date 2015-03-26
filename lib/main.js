Meteor.methods({
    'pushSong': function(song) {
        if(this.userId) {
            song.owner = this.userId;
            delete song.url;
            return Music.insert(song);
        }
    },
    'clear': function() {
        return Music.remove({ owner: this.userId });
    }
});
