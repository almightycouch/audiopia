Template.Dashboard.rendered = function() {
    var self = this;
    self.chart = new Chart($('#chart').get(0).getContext('2d')).Line({
        labels: [],
        datasets: [
            {
                fillColor: 'rgba(220,220,220,0.2)',
                strokeColor: 'rgba(220,220,220,1)',
            }
        ]
    }, {
        responsive: true,
        scaleFontFamily: 'Open Sans',
        scaleFontSize: 10,
        scaleFontColor: '#ccc',
        showTooltips: false,
        pointDot: false
    });

    Tracker.autorun(function(event) {
        var sortOrder = { sort: { timestamp: -1 } }; 
        var increment = function(stat) {
            var timestamp = new Date(stat.timestamp);
            self.chart.addData([stat.total], ('0' + timestamp.getHours()).slice(-2) + ':' + ('0' + timestamp.getMinutes()).slice(-2));
        }
        if(!event.firstRun) {
            self.chart.removeData();
            increment(Stats.findOne({}, sortOrder));
        } else {
            _.each(Stats.find({}, _.extend({ limit: 24 }, sortOrder)).fetch().reverse(), increment);
        }
    });
}

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
