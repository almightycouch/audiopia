Meteor.startup(function () {
    MusicManager.initialize();
    Tracker.autorun(function() {
        var userId = Meteor.userId();
        if(!userId) {
            Meteor.loginVisitor();
        }
        if(!P2P.peer) {
            P2P.peer = new WebRTC(userId, { key: '62is9f6ozx2mx6r' });
            MusicManager.synchronize(function(error) {
                console.warn(error);
            });
        }
    });
    UIkit.domObserve('body');
    Meteor.subscribe('music');
});
