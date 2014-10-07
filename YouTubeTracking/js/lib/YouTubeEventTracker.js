//---- REQUIRE YOU TUBE API ----//
    var tag = document.createElement( 'script' );
    tag.src = "https://www.youtube.com/iframe_api";

    var firstScriptTag = document.getElementsByTagName( 'script' )[0];
    firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
//-----------------------------//

/**
 * 
 * You Tube Events Tracker Namespace.
 * @author      Julio Mora <julio.mora.zamora@gmail.com>
 * @type        Object
 * @namespace   YouTubeEventTracker
 */
var YouTubeEventTracker = {//-------------------->> YouTubeEventTracker
    
    /**
     * 
     * Collection Map of YT.player instances.
     * The expected is to register one intance of TY.Player per each 
     * YouTubeEventTracker.Tracker instance putting as its key ID the 
     * YouTubeEventTracker.Tracker.playerID value.
     * @type        Object
     * @namespace   YouTubeEventTracker.players
     */
    'YTplayers' : {},
    
    /**
     * 
     * Tracker constructor function.
     * @constructor
     * @param   Object options 
     *          <table border=1>
     *              <tr>
     *                  <th>Key</th>
     *                  <th>Mandatory</th>
     *                  <th>Type</th>
     *                  <th>Description</th>
     *              </tr>
     *              <tr>
     *                  <td>playerID</td>
     *                  <td>Yes</td>
     *                  <td>String</td>
     *                  <td>ID of the DOM Element that serves as YT Player container.</td>
     *              </tr>
     *              <tr>
     *                  <td>allowedEvents</td>
     *                  <td>No</td>
     *                  <td>Array</td>
     *                  <td>
     *                      <p>
     *                          Array of strings of with the name of the events to track.
     *                          Possible Values: READY, UNSTARTED, ENDED, PLAYING, PAUSED, 
     *                          BUFFERING, CUED.
     *                      </p>
     *                      <p>
     *                          If this param is ommited, the value will be 'ALL' by default that
     *                          means that all the events will be tracked.
     *                      </p>
     *                  </td>
     *              </tr>
     *              <tr>
     *                  <td>pushEventCallBack</td>
     *                  <td>No</td>
     *                  <td>Function</td>
     *                  <td>
     *                      Function to be called as callback when a YT Player Change Event is triggered 
     *                      and the event is one of the allowed ones.
     *                  </td>
     *              </tr>
     *          </table>
     * @return  YouTubeEventTracker.Tracker
     * @throws  Error
     */
    'Tracker' : function ( options ) {//--------------->> Tracker
        
        if ( typeof YT.PlayerState === 'undefined' ) {//----->> if YT API not loaded
            throw new Error( 'YouTube API is required to track Video Events' );
        }//----->> End if YT API not loaded
        
        if ( typeof jQuery === 'undefined' ) {//----->> if jQuery not loaded
            throw new Error( 'jQuery is required to track Video Events' );
        }//----->> End if jQuery not defined
        
        if ( !options.hasOwnProperty( 'playerID' ) || !document.getElementById( options.playerID.toString() ) ) {//----->> if no playerID
            throw new Error( 'Player ID is mandatory and has to be a DOM Element ID' );
        }//----->> eND if no playerID
        
        /**
         * 
         * ID of the DOM element that serves as YT Player container.
         * @type    String
         */
        this.playerID = options.playerID.toString();
        
        /**
         * 
         * Title of the YT Video
         * @type    Strig
         */
        this.videoTitle = '';
        
        /**
         * 
         * Collection of Event Names to track.
         * @type    Array
         */
        this.allowedEvents = [];
        
        if ( options.hasOwnProperty( 'allowedEvents' ) ) {//----->> if user provide allowedEvents
            
            if ( Object.prototype.toString.call( options.allowedEvents ) !== '[object Array]' ) {//----->> if not Array
                throw new Error( 'Allowed Events must be an Array' );
            }//----->> End if not Array

            for ( index in options.allowedEvents ) {//----->> for each element in Array
                this.allowedEvents[ index ] = options.allowedEvents[ index ].toString().toUpperCase();
            }//----->> End for each element in Array
            
        } else {//----->> else user doesn't provide allowedEvents
            this.allowedEvents = [ 'ALL' ];
        }//----->> End else user doesn't provide allowedEvents
        
        /**
         * 
         * Flag to identify if the player is in pause state.
         * @type    Boolean
         */
        this.isPaused = false;

        /**
         * 
         * Instance reference for distinction on inner function scopes.
         * @type YouTubeEventTracker
         */
        var _self = this;
        
        /**
         * 
         * Internal Reference of the corresponding YT instance.
         * @type    YT.player
         */
        var _player = null;
        
        /**
         * 
         * Retrives and sets the video title from YouTube API via RESTful json.
         * @throws  Error
         */
        this.setVideoTitleFromService = function() {//---------->> setVideoTitleFromService()
            
            $.get( 'http://gdata.youtube.com/feeds/api/videos/' + this.getVideoID() + '?v=2&alt=json', function( data ) {
                _self.videoTitle = data.entry.title.$t;
            } );
            
        };//---------->> End setVideoTitleFromService()
        
        /**
         * 
         * Stablishes the YTPlayer for this instance and retrives the video title
         * from YouTube API via RESTful json.
         * An Error will be thrown if the param is not an YT.layer instance.
         * @param   YT.Player YTPlayer
         * @throws  Error
         */
        this.setPlayer = function( YTPlayer ) {//---------->> setPlayer()

            if ( !YTPlayer.hasOwnProperty( 'L' ) || YTPlayer.L !== 'player' ) {//----->> if not YT.Player instance
                throw new Error( 'A YT.Player instance is required' );
            }//----->> End if not YT.Player instance
            
            _player = YTPlayer;
            YouTubeEventTracker.YTplayers[ this.playerID ] = YTPlayer;
            
            this.setVideoTitleFromService();
            
        };//---------->> End setPlayer()
        
        /**
         * 
         * @param   String actionName
         * @throws  Error
         */
        var _checkPlayerOn = function( actionName ) {//---------->> _checkPlayer
            
            if ( _player === null ) {//----->> if _player not setted
                
                _player = YouTubeEventTracker.YTplayers[ _self.playerID ];

                if ( typeof _player === 'undefinded' ) {//----->> if _player undefined
                    throw new Error( 'An instance of YouTube Player is needed to ' + actionName );
                }//----->> End if _player undefined

            }//----->> End if _player not setted
            
        };//---------->> End _checkPlayer

        /**
         * 
         * Retrives the current enlapsed time of the video.
         * An Error will be thrown if there is no any YT Player for this instance on
         * YouTubeEventTracker.players.
         * @returns String
         * @throws  Error
         */
        this.getPlayerCurrentTime = function() {//---------->> getPlayerCurrentTime()
            
            _checkPlayerOn( 'Get Current Time' );
            
            var _time = _player.getCurrentTime();

            if ( _time > 60 ) {//----->> if _time greater than 60

                
                _time = ( _time/60 ).toFixed( 2 );
                _time = _time.split( '.' );

                if ( _time[ 0 ] < 10 ) {//----->> if minuts less than 10
                    _time[ 0 ] = '0' + _time[ 0 ];
                }//----->> End if minuts less than 10

                _time = _time.join( ':' );

            } else {//----->> else if _time less than 60

                _time = parseInt( _time );
                _time = ( _time < 10 ) ?'00:0' + _time : '00:' + _time;

            }//----->> End if _time less than 60

            return _time;

        };//---------->> End getPlayerCurrentTime()
        
        /**
         * 
         * Retrives the ID of the YT Video by its embed code.
         * @returns String
         * @throws  Error
         */
        this.getVideoID = function() {//---------->> getVideoID()
            
            _checkPlayerOn( 'Retrive Video ID' );
            
            var embedCode = _player.getVideoEmbedCode();
            embedCode = embedCode.split( '?' );
            embedCode = embedCode[ 0 ];
           
            var lastSlashIndex = embedCode.lastIndexOf( '/' ) + 1;
            var videoID = embedCode.slice( lastSlashIndex, embedCode.length );
            
            return videoID;
            
        };//---------->> End getVideoID()
        
        /**
         * 
         * Function to be registered as main callback on YT.Player.events.onReady
         * This function will be called when a YT.Player is ready to be played.
         * @param   Event event
         */
        this.onPlayerReady = function ( event ) {//---------->> onPlayerReady()
            _self.pushEvent( 'READY' );
        };//---------->> End onPlayerReady()

        /**
         * 
         * Function to be registered as main callback on YT.Player.events.onStateChange.
         * This function will be called when a YT.Player changes its state.
         * @param   Event event
         */
        this.onPlayerStateChange = function ( event ) {//---------->> onPlayerStateChange()

            var _playerState = YT.PlayerState;

            switch ( event.data ) {//----->> switch event.data

                case _playerState.UNSTARTED:
                    _self.pushEvent( 'UNSTARTED' );
                break;

                case _playerState.ENDED:
                    _self.pushEvent( 'ENDED' );
                break;

                case _playerState.PLAYING:
                    _self.pushEvent( 'PLAYING', _self.getPlayerCurrentTime() );
                    this.isPaused = false;
                break;

                case _playerState.PAUSED:

                    if ( !this.isPaused ) {//----->> if not paused
                        _self.pushEvent( 'PAUSED', _self.getPlayerCurrentTime() );
                    }//----->> End if not paused

                    this.isPaused = true;

                break;

                case _playerState.BUFFERING:
                    _self.pushEvent( 'BUFFERING' );
                break;

                case _playerState.CUED:
                    _self.pushEvent( 'CUED' );
                break;

            }//----->> End switch event.data

        };//---------->> End onPlayerStateChange()
        
        /**
         * 
         * Function to be registered as main callback on YT.Player.events.onError.
         * This function will be called when a YT.Player produces an error.
         * @param   Event event
         * @throws  Error
         */
        this.onError = function( event ) {//---------->> onError()
            
            var _errorMessage = '';
            
            switch( event.data ) {//----->> switch event.data
                
                case 2:
                    _errorMessage = 'Te request contains an invalid parameter value';
                break;
                
                case 5:
                    _errorMessage = 'The requested content cannot be played in an HTML5 player';
                break;
                
                case 100:
                    _errorMessage = 'Te video requested was not found';
                break;
                
                case 101:
                case 150:
                    _errorMessage = 'The owner of the requested video does not allow it to be played in embedded players';
                break;
                
            }//----->> End switch event.data
            
            throw new Error( _errorMessage );
            
        };//---------->> End onerror()
        
        /**
         * 
         * This function will be called when the player changed its state.
         * It will validate if the event is one of the allowed ones and, 
         * if it's valid, call the options.pushEventCallBack as callback.
         * @param   String eventName
         * @param   String extraData
         */
        this.pushEvent = function ( eventName, extraData ) {//---------->> pushEvent()
            
            extraData = extraData || '';

            if ( this.allowedEvents[ 0 ] === 'ALL' || this.allowedEvents.indexOf( eventName ) >= 0 ) {//----->> if is an allowed Event
                
                if ( typeof options.pushEventCallBack === 'function' ) {//----->> if options.pushEventCallBack is function
                    options.pushEventCallBack.apply( _self, [ eventName, extraData ] );
                }//----->> End if options.pushEventCallBack is function
                
            }//----->> End if is an allowed Event

        };//---------->> End pushEvent()
        
        /**
         * 
         * Initialize and register the YT.Player instance for this YouTubeTracker.Tracker instance
         * @param   Object playerOptions Map of YT.Player constructor options.
         * @return  YouTubeEventTracker.Tracker
         */
        this.startYTPlayer = function( playerOptions ) {//---------->> startYTPlayer()
            
            playerOptions = playerOptions || {};
            
            var _options = jQuery.extend( {}, {
               'events' : {
                   'onReady': this.onPlayerReady,
                   'onStateChange': this.onPlayerStateChange,
                   'onError' : this.onError
               }
            }, 
            playerOptions );

           /**
            * 
            * Setting the YT.Player instance for this YouTubeTracker.Tracker 
            * instance.
            */
            this.setPlayer( new YT.Player( this.playerID, _options ) );
            
            return this;
            
        };//---------->> End startYTPlayer()
        
        return this;
        
    }//--------------->> End Tracker
    
};//-------------------->> End YouTubeEventTracker