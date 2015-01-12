Template.MusicTable.events({
    'click tbody tr': function(event, template) {
        AudioPlayer.load(this);
    }
})

