/**
 * 
 * Function called as callback when YT API is loaded and when the
 * YT.PLayer instances could be made.
 */
function onYouTubeIframeAPIReady() {//---------->> onYouTubeIframeAPIReady()
    
    var iFrameEventsList = $( '#iFrameEventsList' );

    /**
     * 
     * @type    YouTubeEventTracker.Tracker
     * Tracker instance that only will push PLAYING, PAUSED and ENDED events for
     * the player located on DOM Element with ID iframePlayer.
     */
    var iFrameTracker = new YouTubeEventTracker.Tracker( {
        'playerID' : 'iframePlayer',
        'allowedEvents' : [ 'PLAYING', 'PAUSED', 'ENDED' ],
        'pushEventCallBack' : function( eventName, extraData ) {

            iFrameEventsList.append( 
                '<li> Player ' + 
                this.playerID + 
                ' with Title: ' 
                + this.videoTitle + 
                ' has changed its State to: ' +  
                eventName + ' [' + extraData + ']</li>' 
            );

            //_gaq.push( [ '_trackEvent', 'Videos', eventName, this.videoTitle + ' ' + extraData ] );
        }
    } );
    
    /**
     * 
     * Override of the YouTubeEventTracker.Tracker.onPlayerReady method
     * only for iFrameTracker instance.
     */
    iFrameTracker.onPlayerReady = function( event ) {
        event.target.playVideo();
    };
    
    /**
     * 
     * Start of the YT.player for iFrameTracker YouTubeEventTracker.Tracker instance.
     * As all the config params are located on the iframe URL, no params are needed.
     */
    iFrameTracker.startYTPlayer();
    
    var injectedEventsList = $( '#injectionEventsList' );
    
    /**
     * 
     * @type YouTubeEventTracker.Tracker
     * Tracker instance that will push ALL events for
     * the player located on DOM Element with ID injectionContainer.
     */
    var injectedTracker = new YouTubeEventTracker.Tracker( {
        'playerID' : 'injectionContainer',
        'pushEventCallBack' : function( eventName, extraData ) {
            
            injectedEventsList.append( 
                '<li> Player ' + 
                this.playerID + 
                ' with Title: ' 
                + this.videoTitle + 
                ' has changed its State to: ' +  
                eventName + ' [' + extraData + ']</li>' 
            );

            //_gaq.push( [ '_trackEvent', 'Videos', eventName, this.videoTitle + ' ' + extraData ] );
        }
    } );
    
    /**
     * 
     * Start of the YT.player for injectedTracker YouTubeEventTracker.Tracker instance.
     * As the player will be injected, the config params are sended according to YT.Player API.
     */
    injectedTracker.startYTPlayer( {
        videoId : 'aCOt45adGVc',
        width: 640,
        height: 390,
        playerVars : {
            controls : 0,
            autoplay : 1
        }
    } );
    
}//---------->> End onYouTubeIframeAPIReady()