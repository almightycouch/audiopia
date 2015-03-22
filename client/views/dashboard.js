Template.Dashboard.rendered = function() {
    var self = this;
    var data = {
        labels: ['03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '03/21', '03/22'],
        datasets: [
            {
                label: 'My First dataset',
                fillColor: 'rgba(220,220,220,0.2)',
                strokeColor: 'rgba(220,220,220,1)',
                pointColor: 'rgba(220,220,220,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: [22, 43, 53, 65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                fillColor: 'rgba(151,187,205,0.2)',
                strokeColor: 'rgba(151,187,205,1)',
                pointColor: 'rgba(151,187,205,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(151,187,205,1)',
                data: [34, 27, 28, 28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
    var chart = new Chart($('#myChart').get(0).getContext('2d')).Line(data, {
        responsive: true,
        scaleFontFamily: 'Open Sans',
        scaleFontSize: 10,
        scaleFontColor: '#ccc',
        showTooltips: false,
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
