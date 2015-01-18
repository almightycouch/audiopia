Template.TableView.events({
    'click tbody tr': function(event, template) {
        AudioPlayer.load(this, function() {
        }, function(error) {
            console.warn(error);
        });
    }
})

