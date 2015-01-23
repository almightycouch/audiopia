Template.TableView.events({
    'click tbody tr': function(event, template) {
        var song = this;
        AudioPlayer.load(song, function() {
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    }
})

