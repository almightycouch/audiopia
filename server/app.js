Meteor.startup(function () {
    MusicCollection.remove({});
    Meteor.publish('music', function(){
        return MusicCollection.find();
    });
    Meteor.users.find({ 'status.online': true }).observe({
        removed: function(user) {
            MusicCollection.remove({'owner': user._id});
        }
    });
});
