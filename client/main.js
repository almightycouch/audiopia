Meteor.startup(function () {
    Meteor.subscribe('music');
    MusicManager.synchronize(function(error) {
        console.warn(error);
    });
    UIkit.domObserve('body');
});
