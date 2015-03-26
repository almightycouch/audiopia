Meteor.methods({
    'pushSong': function(song) {
        var self = this;
        if(self.userId) {
            song = _.omit(song, 'url', 'owners');
            Music.insert(_.extend({ owners: [self.userId] }, song), function(error, id) {
                if(error) {
                    Music.update({ _id: song._id }, { $set: _.omit(song, '_id'), $push: { owners: self.userId } });
                }
            });
        }
    },
    'clear': function(owner) {
        var self = this;
        if(!self.userId) {
            self.userId = owner;
        }
        Music.remove({ $and: [{ owners: self.userId }, { owners: { $size: 1 } }] }, function(error) {
            Music.update({ owners: self.userId }, { $pull: { owners: self.userId } }, { multi: true });
        });
    }
});
