Template.Collection.created = function() {
    var self = this;
    self.search = new ReactiveVar();
}

Template.Collection.helpers({
    'songs': function() {
        var self = Template.instance();
        var search = self.search.get();
        var query = {};
        if(typeof search == 'string') {
            var regexp = new RegExp(search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'i');
            _.extend(query, { '$or': [{ 'artist': regexp }, { 'album': regexp }, { 'title': regexp }]});
        }
        return this.model.find(query, { fields: this.fields, sort: this.sort });
    }
});

Template.Collection.events({
    'input input[role="search"]': function(event, template) {
        var self = template;
        self.search.set(event.target.value);
    },
    'click table tbody tr': function(event, template) {
        var song = this;
        AudioPlayer.load(song, function() {
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    }
})

