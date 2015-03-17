Template.Dashboard.helpers({
    'currentImport': function() {
        return _.isObject(Session.get('currentImport'));
    },
    'removeButton': function() {
        if(!MusicManager.localCollection.find().count()) {
            return { disabled: 'disabled' };
        }
    }
});

Template.Dashboard.events({
    'change input[type=file]': function(event, template) {
        var self = template;
        MusicManager.addSongs(event.target.files, function() {
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    },
    'click button#cancel': function(event, template) {
        Session.set('currentImport', { abort: true });
    },
    'click button#remove': function(event, template) {
        MusicManager.clear(function() {
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    }
})
