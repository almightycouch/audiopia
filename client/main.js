Meteor.startup(function () {
    if(!(window.chrome && window.navigator.vendor == 'Google Inc.' && parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) >= 30)) {
        alert('You need at least Chrome version 30 to run this app.');
        window.location.replace('http://www.google.com/chrome/');
        return;
    }

    MusicManager.localStorage = new PersistentStorage();

    Meteor.subscribe('music');
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
});
