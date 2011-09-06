// PLUGIN: player ui

(function (Popcorn) {

    Popcorn(function() {
       var head = document.head, 
           link;
       
       head.appendChild(
           ( 
               link = document.createElement("link"), 
               link.rel = "stylesheet", 
               link.href = "popcorn.player-ui.css",
               link
           )
       ); 
    });

    Popcorn.prototype.playerui = function(params) {
        
        var self = this;
        var parent = this.media.parentNode;
        
        this.media.controls = false;
            
        // Default options
        if (params === undefined) {
            params = {play:true};
        }
        
        // Create overlay that covers entire video to enable CSS hover that displays buttons
        var overlay = document.createElement('div');
        overlay.setAttribute('class', 'player-ui-overlay');        
        parent.appendChild(overlay);
        
        // It seems at DOMContentLoaded the video height can be wrong,
        // so we defer calculating overlay dimentions
        function adjustOverlaySize() {
            overlay.style.width = self.position().width + "px";
            overlay.style.height = self.position().height + "px";
            overlay.style.top = self.position().top + "px";
            overlay.style.left = self.position().left + "px";
        }
                
        // If the overlay size is wrong, you don't know which of these will be moused over first,
        // so pay attention to both
        this.video.addEventListener('mouseover', adjustOverlaySize);
        overlay.addEventListener('mouseover', adjustOverlaySize);
        
        // This element styles the area where the buttons appear
        var buttonBG = document.createElement('div');
        buttonBG.setAttribute('class', 'player-ui-buttons');
        buttonBG.style.width = self.position().width + "px";
        buttonBG.style.bottom = 0;
        buttonBG.style.left = 0;
        overlay.appendChild(buttonBG);
        
        // Button constructor
        function Button(name, className, onClick) {
            var element = document.createElement('div');
            element.innerHTML = name;
            element.setAttribute('class', 'player-ui-button ' + className);
            element.addEventListener('click', function(event) {
                onClick(element);
            }, false);
            
            this.append = function(parent) {
                parent.appendChild(element);
            }
        }
        
        // Create appropriate buttons based on parameters
        if (params.play) {
            var playButton = new Button('<div class="play-ui-icon-play"></div>', "player-ui-button-play", function(element) {
                if (self.media.paused) {
                    self.play();
                    element.innerHTML = '<div class="play-ui-icon-pause"></div><div class="play-ui-icon-pause"></div>';
                    element.className = "player-ui-button player-ui-button-pause";
                }
                else {
                    self.pause();
                    element.innerHTML = '<div class="play-ui-icon-play"></div>';
                    element.className = "player-ui-button player-ui-button-play";
                }
            });
            playButton.append(overlay);
        }
        
    }

})( Popcorn );
