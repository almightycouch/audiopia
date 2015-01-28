Template.Collection.created = function() {
    var self = this;
    self.search = new ReactiveVar();
}

Template.Collection.helpers({
    'model': function() {
        var self = Template.instance();
        var search = self.search.get();
        var query = {};
        if(typeof search == 'string') {
            var regexp = new RegExp(search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'i');
            _.extend(query, { '$or': [{ 'artist': regexp }, { 'album': regexp }, { 'title': regexp }]});
        }
        return this.collection.find(query, { fields: this.fields, sort: this.sort });
    },
    'rowAttributes': function() {
        var currentSong = Session.get('currentSong');
        if(!currentSong || currentSong._id != this._id) {
        } else {
            return { class: 'uk-active' };
        }
    }
});

Template.Collection.events({
    'input aside input[role="search"]': function(event, template) {
        var self = template;
        self.search.set(event.target.value);
    },
    'change table thead tr th input[type="checkbox"]': function(event, template) {
        var self = template;
        var checked = self.$(event.target).prop('checked');
        self.$('td input[type="checkbox"]').each(function() {
            self.$(this).prop('checked', checked);
        });
    },
    'change table tbody tr td input[type="checkbox"]': function(event, template) {
        var self = template;
        var allChecked = true;
        self.$('td input[type="checkbox"]').each(function() {
            allChecked = self.$(this).prop('checked');
            return allChecked;
        });
        self.$('th input[type="checkbox"]').prop('checked', allChecked);
    },
    'click table tbody tr td:not(:first-child)': function(event, template) {
        var self = template;
        AudioPlayer.load(this, function() {
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        });
    }
})

