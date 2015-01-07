UI.registerHelper('activeRoute', function(route, options) {
    var router = Router.current();
    var params = options.hash;
    if(router.route && router.route.getName() == route) {
        if(!_.isEmpty(params.query)) {
            var items = params.query.split('&');
            for(var i in items) {
                var item = items[i].split('=');
                if(item.length != 2 || router.params.query[item[0]] != item[1]) {
                    return;
                }
            }
        } else if(!_.isEmpty(router.params.query)) {
            return;
        }
        if(params.hash == router.params.hash) {
            return 'uk-active';
        }
    }
});

UI.registerHelper('formatSecs', function(secs) {
    if(secs != -1) {
        var hours = Math.floor(secs / 3600), mins = Math.floor(secs % 3600 / 60), secs = Math.ceil(secs % 3600 % 60);
        return (hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0' + hours + ':' : hours + ':') + (mins.toString().length < 2 ? '0'+ mins : mins) + ':' + (secs.toString().length < 2 ? '0' + secs : secs);
    } else {
        return '\u2026';
    }
});
