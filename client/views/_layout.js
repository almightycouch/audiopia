Template._layout.rendered = function() {
    var self = this;
    $('body').on('keydown', function(event) {
        if(event.shiftKey) {
            switch(event.keyCode) {
                case 37: // <left>
                    AudioPlayer.loadPrevious();
                    break;
                case 39: // <right>
                    AudioPlayer.loadNext();
                    break;
                default:
                    return;
            }
            return false;
        } else if(event.metaKey && event.keyCode == 70) {
            $('input[type="search"]').focus();
            return false;
        }
    });
}

Template._layout.helpers({
    'onlineCount': function() {
        return MusicCollection.find().count();
    },
    'localCount': function() {
        return MusicManager.localCollection.find().count();
    }
});
