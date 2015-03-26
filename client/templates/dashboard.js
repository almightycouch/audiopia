Template.Dashboard.rendered = function() {
    var self = this;
    self.chart = new Chart($('#chart').get(0).getContext('2d')).Line({
        labels: [],
        datasets: [
            {
                fillColor: 'rgba(220,220,220,0.2)',
                strokeColor: 'rgba(220,220,220,1)',
            }, {
                fillColor: 'rgba(151,187,205,0.2)',
                strokeColor: 'rgba(151,187,205,1)',
            }
        ]
    }, {
        animation: false,
        responsive: true,
        pointDot: false,
        showTooltips: false,
        scaleFontFamily: 'Open Sans',
        scaleFontSize: 9,
        scaleFontColor: '#aaa'
    });

    self.autorun(function(event) {
        var limit = 30;
        var sortOrder = { sort: { timestamp: -1 } }; 
        var increment = function(stat) {
            if(stat) {
                var timestamp = new Date(stat.timestamp);
                self.chart.addData([stat.songs, stat.users], ('0' + timestamp.getHours()).slice(-2) + ':' + ('0' + timestamp.getMinutes()).slice(-2));
            }
        }
        if(!event.firstRun) {
            if(self.chart.datasets[0].points.length > limit) {
                self.chart.removeData();
            }
            increment(Stats.findOne({}, sortOrder));
        } else {
            _.each(Stats.find({}, _.extend({ limit: limit }, sortOrder)).fetch().reverse(), increment);
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
    },
    'downloads': function() {
        return _.toArray(Session.get('downloads'));
    }
});

Template.Dashboard.events({
    'change input[type=file]': function(event, template) {
        var self = template;
        MusicManager.importSongs(event.target.files, function() {
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
