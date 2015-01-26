Router.configure({
    layoutTemplate: '_layout'
});

Router.route('/', function() {
    var self = this;
    self.render('Dashboard');
}, {
    name: 'dashboard'
});

Router.route('/music/', function() {
    var self = this;
    self.render('Collection', {
        data: {
            model: self.params.hash == 'me' ? MusicManager.localCollection : MusicCollection,
            sort: { artist: 1, year: -1, album: 1, track: 1 },
            fields: { track: true, title: true, album: true, artist: true, duration: true, url: true, owner: true }
        }
    });
}, {
    name: 'music'
});
