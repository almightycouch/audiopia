Router.configure({
    layoutTemplate: '_layout'
});

Router.route('/', function() {
    Router.go('music');
}, { name: 'home' });

Router.route('/dashboard', function() {
    var self = this;
    self.subscribe('stats').wait();
    if(!self.ready()) {
        self.render('Loading');
    } else {
        self.render('Dashboard');
    }
}, { name: 'dashboard' });

Router.route('/music/', function() {
    var self = this;
    self.render('Collection', {
        data: {
            fields: { track: true, title: true, album: true, artist: true, duration: true, url: true, mime: true, extension: true, owners: true },
            sort: { artist: 1, year: -1, album: 1, track: 1 },
            collection: self.params.hash == 'me' ? MusicManager.localCollection : MusicManager.sharedCollection,
        }
    });
}, {
    name: 'music',
    onBeforeAction: function() {
        Session.set('search', null);
        this.next();
    }
});
