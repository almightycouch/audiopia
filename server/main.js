Meteor.startup(function () {
    Meteor.publish('music', function() {
        return Music.find();
    });

    Meteor.publish('stats', function() {
        return Stats.find();
    });

    Music.remove({});
    Meteor.users.find({ 'status.online': true }).observe({
        removed: function(user) {
            Meteor.call('clear', user._id);
        }
    });

    Meteor.setInterval(function() {
        Stats.insert({ 'timestamp': new Date().valueOf(), 'songs': Music.find().count(), 'users': Meteor.users.find({ 'status.online': true }).count() });
    }, 120000);
});
