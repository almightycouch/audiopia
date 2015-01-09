Template.Dashboard.events({
    'change input[type=file]': function(event, template) {
        MusicManager.addSongs(event.target.files, function(error) {
            console.warn(error);
        });
    }
})
