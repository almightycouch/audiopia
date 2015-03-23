Template.AudioPlayer.created = function() {
    var self = this;
    self._classPrefix = 'audioplayer-';
    self.audioElement = AudioPlayer.audioElement;
    self.duration = new ReactiveVar(Infinity);
    self.currentTime = new ReactiveVar(0);
}

Template.AudioPlayer.rendered = function() {
    var self = this;
    var tick = 0;
    var updateCallback = function(currentTime) {
        if(currentTime == undefined) {
            if(tick) {
                if(!self.audioElement.paused) {
                    updateCallback((performance.now() - tick) / 1000);
                }
                setTimeout(updateCallback, 500);
            }
        } else {
            self.currentTime.set(currentTime);
            self.$('[data-role="progress-slider"] :last-child').width((currentTime / self.duration.get()) * 100 + '%');
        }
    };
    var clearCallback = function(event) {
        updateCallback(0);
        $(self.firstNode).addClass(self._classPrefix + 'disabled');
        $(self.firstNode).removeClass(self._classPrefix + 'playing');
    }
    self.audioElement.addEventListener('canplay', function(event) {
        $(self.firstNode).removeClass(self._classPrefix + 'disabled');
        this.play();
    });
    self.audioElement.addEventListener('ended', function(event) {
        clearCallback(event);
        AudioPlayer.loadNext();
    });
    self.audioElement.addEventListener('emptied', clearCallback);
    self.audioElement.addEventListener('play', function(event) {
        $(self.firstNode).addClass(self._classPrefix + 'playing');
    });
    self.audioElement.addEventListener('pause', function(event) {
        $(self.firstNode).removeClass(self._classPrefix + 'playing');
    });
    self.audioElement.addEventListener('volumechange', function(event) {
        $(self.firstNode).toggleClass(self._classPrefix + 'muted', this.muted);
        self.$('[data-role="volume-slider"] :first-child').height(Math.ceil(this.volume * 100) + '%');
    });
    self.audioElement.addEventListener('durationchange', function(event) {
        var duration = this.duration;
        if(!duration || duration == Infinity) {
            tick = performance.now();
            updateCallback();
            duration = Session.get('currentSong').duration;
        } else if(tick) {
            tick = 0;
        }
        self.duration.set(duration);
    });
    self.audioElement.addEventListener('timeupdate', function(event) {
        if(this.seekable.length) {
            updateCallback(this.currentTime);
        }
    });
    self.audioElement.addEventListener('error', function(event) {
        var errorMessage = new String();
        switch(this.error.code) {
            default:
                errorMessage = 'Failed to load song.';
        }
        UIkit.notify(errorMessage, 'warning');
    });
}

Template.AudioPlayer.helpers({
    'duration': function() {
        var self = Template.instance();
        return self.duration.get();
    },
    'currentTime': function() {
        var self = Template.instance();
        return self.currentTime.get();
    }
});

Template.AudioPlayer.events({
    'click [data-role="play-button"]': function(event, template) {
        var self = template;
        if(self.audioElement.readyState == self.audioElement.HAVE_ENOUGH_DATA) {
            if(!self.audioElement.paused) {
                self.audioElement.pause();
            } else {
                self.audioElement.play();
            }
        }
    },
    'click [data-role="volume-button"]': function(event, template) {
        var self = template;
        self.audioElement.muted = !self.audioElement.muted;
    },
    'mousedown [data-role$="-slider"]': function(event, template) {
        var self = template;
        var callback = undefined;
        var target = $(event.currentTarget);
        switch(target.attr('data-role')) {
            case 'volume-slider': callback = function(event) {
                self.audioElement.volume = Math.abs((event.pageY - (target.offset().top + target.height())) / target.height());
            }; break;
            case 'progress-slider': callback = function(event) {
                self.audioElement.currentTime = Math.round((self.audioElement.duration * (event.pageX - target.offset().left)) / target.width());
            }; break;
        }
        target.on('mousemove', function(event) {
            try {
                callback(event);
            } catch(e) {}
        }).on('mouseup', function(event) {
            target.unbind('mousemove');
        });
        callback(event);
    }
});
