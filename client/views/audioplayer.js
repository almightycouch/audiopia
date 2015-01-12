Template.AudioPlayer.created = function() {
    this.audioElement = AudioPlayer.audioElement;
    this._classPrefix = 'AudioPlayer-';
    this.duration = new ReactiveVar(-1);
    this.currentTime = new ReactiveVar(0);
}

Template.AudioPlayer.rendered = function() {
    var self = this;
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
        self.duration.set(this.duration);
    });
    self.audioElement.addEventListener('timeupdate', function(event) {
        self.currentTime.set(this.currentTime);
        self.$('[data-role="progress-slider"] :last-child').width((this.currentTime / self.duration.get()) * 100 + '%');
    });
}

Template.AudioPlayer.helpers({
    duration: function() {
        var self = Template.instance();
        return self.duration.get();
    },
    currentTime: function() {
        var self = Template.instance();
        return self.currentTime.get();
    }
});

Template.AudioPlayer.events({
    'click [data-role="play-button"]': function(event, template) {
        var self = template;
        if(!self.audioElement.paused) {
            self.audioElement.pause();
        } else {
            self.audioElement.play();
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
