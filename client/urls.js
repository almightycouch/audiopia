Router.configure({
    layoutTemplate: '_layout'
});

Router.route('/', function() {
    Router.go('music');
}, {
    name: 'home'
});

Router.route('/dashboard', function() {
    var self = this;
    self.render('Dashboard');
}, {
    name: 'dashboard'
});

Router.route('/music/', function() {
    var self = this;
    var hash = self.params.hash;
    self.render('Collection', {
        data: {
            fields: { track: true, title: true, album: true, artist: true, duration: true, url: true, mime: true, owner: true },
            sort: { artist: 1, year: -1, album: 1, track: 1 },
            collection: hash == 'me' ? MusicManager.localCollection : MusicCollection,
        }
    });
}, {
    name: 'music',
    onBeforeAction: function () {
        Session.set('search', null);
        this.next();
    }
});
