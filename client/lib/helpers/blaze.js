UI.registerHelper('activeRoute', function(route) {
    if(Router.current().route.getName() == route) {
        return 'uk-active';
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
