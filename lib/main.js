Meteor.methods({
    pushSong: function(song) {
        return MusicCollection.insert(_.extend(song, { owner: this.userId }));
    }
});
