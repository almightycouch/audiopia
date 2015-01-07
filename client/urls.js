Router.configure({
    layoutTemplate: '_layout'
});

Router.route('/', function() {
    this.render('dashboard');
}, {
    name: 'dashboard'
});

Router.route('/music', function() {
    this.render('music');
}, {
    name: 'music'
});
