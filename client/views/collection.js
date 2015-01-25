Template.Collection.rendered = function() {
    var self = this;
}

Template.Collection.events({
    'click table tbody tr': function(event, template) {
        var song = this;
        AudioPlayer.load(song, function() {
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    }
})

