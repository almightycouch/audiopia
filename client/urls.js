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
            model: function() {
                var query = {};
                var sort = { artist: 1, year: -1, album: 1, track: 1 };
                var fields = { track: true, title: true, album: true, artist: true, duration: true, url: true, owner: true };
                var collection = null;
                if(self.params.hash == 'me') {
                    collection = MusicManager.localCollection;
                } else {
                    collection = MusicCollection;
                }
                return collection.find(query, { fields: fields, sort: sort });
            }
        }
    });
}, {
    name: 'music'
});
