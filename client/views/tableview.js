Template.TableView.events({
    'click tbody tr': function(event, template) {
        var song = this;
        AudioPlayer.load(song, function() {
            console.log(song._id);
        }, function(error) {
            console.warn(error);
        });
    }
})

