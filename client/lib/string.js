String.prototype.format = function() {
    var formatted = this;
    if(arguments.length == 1 && arguments[0] instanceof Object) {
        var args = arguments[0];
        for(var i in args) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, args[i]);
        }
    } else if(arguments.length > 1) {
        formatted = formatted.format(_.extend({}, arguments));
    }
    return formatted;
}
