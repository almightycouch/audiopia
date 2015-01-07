Router.configure({
    layoutTemplate: '_layout'
});

Router.route('/', function() {
    var self = this;
    self.render('dashboard');
}, {
    name: 'dashboard'
});

Router.route('/music/', function() {
    var self = this;
    self.render('music', {
        data: {
            model: MusicManager.requestModel(self.params)
        }
    });
}, {
    name: 'music'
});
