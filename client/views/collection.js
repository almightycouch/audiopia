Template.Collection.created = function() {
    var self = this;
    self._selected = new ReactiveVar();
    self._loading = new ReactiveVar();
    self.load = function(song, options, resetCollection) {
        self._loading.set(song);
        AudioPlayer.load(song, function() {
            self._loading.set(null);
        }, function(error) {
            UIkit.notify(error.message, 'warning');
        }, options);
        if(resetCollection) {
            self._collection = self.data.collection;
        }
    }
    self.loadNext = function() {
        var song = Session.get('currentSong');
        if(!song) {
        } else {
            self.load(self.findNext(song, 1));
        }
    },
    self.loadPrevious = function() {
        var song = Session.get('currentSong');
        if(!song) {
        } else {
            self.load(self.findNext(song, -1));
        }
    },
    self.selectNext = function() {
        var song = self._selected.get();
        if(!song) {
        } else {
            self._selected.set(self.findNext(song, 1));
        }
    }
    self.selectPrevious = function() {
        var song = self._selected.get();
        if(!song) {
        } else {
            self._selected.set(self.findNext(song, -1));
        }
    }
    self.findNext = function(song, order, sort) {
        if(!order) order = 1;
        var query = {}, sort = _.extend({}, sort ? sort : self.data.sort);
        var index = 0, lastIndex = _.size(sort) -1;
        var field;
        for(field in sort) {
            var value = song[field];
            var operator = sort[field] == order ? '$gt' : '$lt';
            if(!value) {
                continue; // TODO
            } else if(++index < lastIndex) {
                query[field] = value; 
            } else {
                query[field] = {};
                query[field][operator] = value;
            }
        }
        var collection = null;
        if(song != self._selected.get()) {
            collection = self._collection;
        } else {
            collection = self.data.collection;
            _.extend(query, self.searchQuery());
        }
        var nextSong = collection.findOne(query, { sort: _.object(_.map(self.data.sort, function(value, key) {
            return [key, value * order];
        })), fields: self.data.fields });
        if(!nextSong) {
            delete sort[field];
            nextSong = self.findNext(song, order, sort);
        }
        return nextSong;
    }
    self.searchQuery = function() {
        var query = {};
        var search = Session.get('search');
        if(typeof search == 'string') {
            var regexp = new RegExp(search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'i');
            _.extend(query, { '$or': [{ 'artist': regexp }, { 'album': regexp }, { 'title': regexp }]});
        }
        return query;
    }
    _.extend(AudioPlayer, { loadNext: self.loadNext, loadPrevious: self.loadPrevious });
}

Template.Collection.rendered = function() {
    var self = this;
    self.$('table').focus();
}

Template.Collection.helpers({
    'model': function() {
        var self = Template.instance();
        return this.collection.find(self.searchQuery(), { fields: this.fields, sort: this.sort });
    },
    'rowAttributes': function() {
        var self = Template.instance();
        var attributes = {};
        if(!AudioPlayer.canPlay(this)) {
            _.extend(attributes, { disabled: 'disabled' });
        }
        if(_.isEqual(self._selected.get(), this)) {
            _.extend(attributes, { selected: 'selected' });
        }
        if(_.isEqual(self._loading.get(), this)) {
            _.extend(attributes, { role: 'loading' });
        }

        if(_.isEqual(Session.get('currentSong'), this)) {
            _.extend(attributes, { class: 'uk-active' });
        }
        return attributes;
    },
    'search': function() {
        return Session.get('search');
    }
});

Template.Collection.events({
    'input aside input[type="search"]': function(event, template) {
        var self = template;
        Session.set('search', event.target.value);
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
    'click table tbody tr': function(event, template) {
        var self = template;
        self._selected.set(this);
    },
    'dblclick table tbody tr': function(event, template) {
        var self = template;
        self.load(this, event.shiftKey ? { action: 'download' } : {}, true);
    },
    'keydown table tbody': function(event, template) {
        var self = template;
        switch(event.keyCode) {
            case 13: // <return>
                self.load(self._selected.get(), true);
                break;
            case 38: // <up>
                self.selectPrevious();
                break;
            case 40: // <down>
                self.selectNext();
                break;
            default:
                return;
        }
        return false;
    }
})
