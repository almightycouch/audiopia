Meteor.startup(function () {
    MusicManager.initialize();
    UIkit.domObserve('body');
});
