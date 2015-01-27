Template.Dashboard.events({
    'change input[type=file]': function(event, template) {
        MusicManager.addSongs(event.target.files, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    },
    'click button': function(event, template) {
        MusicManager.clear(function() {
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    }
})
