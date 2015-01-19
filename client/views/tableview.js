Template.TableView.events({
    'click tbody tr': function(event, template) {
        var song = this;
        AudioPlayer.load(song, function() {
            UIkit.notify('Loaded', { timeout: 1000, status: 'success' });
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    }
})

