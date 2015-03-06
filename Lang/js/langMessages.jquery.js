/**
 *
 * langMessages.jquery.js
 * @author      Julio Mora <julio@ingeniagroup.com>
 * @version     1.0
 * @description Definition of the language messages jQuery plugin
 */
( function( $ ) {//-------------------->> jQuery Clousure

    /**
     *
     * @property    _messages
     * @private
     * @type        Object
     * @description Repository of lang messages.
     */
    var _messages = {};

    /**
     *
     * @namespace   $
     * @description Definition of the plugin constructor
     */
    $.langMessages = function( options ) {//--------------->> langMessages()

        /**
         *
         * @property    _options
         * @private
         * @type        Object
         * @description Final plugin config options.
         */
        var _options = $.extend( {}, $.langMessages.defaults, options );

        /**
         *
         * @param       langID String of the requested language
         * @throws      Error
         * @description Tries to retrieve the messages belonging to a language by
         *              its ID as long as it is not already present on _messages
         *              property.
         */
        var _setLangMessages = function( langID ) {//--------------->> _setLangMessages()

            langID = langID.toString();

            if( !_messages.hasOwnProperty( langID ) ) {//---------->> if lag no present in _messages

                var requestPath = _options.langMessagesPath + _options.langMessPrefix + langID + '.' + _options.langMessExt;

                $.ajax( {//---------->> $.ajax()

                    url         : requestPath,
                    async       : false,
                    type        : 'GET',
                    dataType    : 'text',
                    success     : function( response ) {//---------->> success()
                        
                        try {//---------->> try
                            _messages[ langID ] = response.toString().parseJSON();
                        } catch ( err ) {//---------->> catch
                            throw new SyntaxError( 'Error Parsing JSON format: ' + err.message );
                        }//---------->> End try/catch

                    },//---------->> End success()
                    error       : function() {//---------->> error()
                        throw new Error( 'The messages of the language with ID "' + langID + '" were not found'  );
                    }//---------->> End error()

                } );//---------->> End $.ajax()

            }//---------->> End if lag no present in _messages

        };//--------------->> End _setLangMessages()

        /**
         *
         * @private
         * @param       langID String Language Id to ve evaluated.
         * @throws      Error
         * @return      String
         * @description Checks if a language with the specified ID is registered in
         *              the module.
         *              An error will be thrown if there is not a language with the
         *              received ID.
         */
        var _getLangID = function( langID ) {//--------------->> _getLangID()
            langID = langID.toString().toLowerCase();
            _setLangMessages( langID );
            return langID;
        };//--------------->> End _getLangID()

        /**
         *
         * @description Getting the default language messages.
         */
        _setLangMessages( _options.defaultLang );

        /**
         *
         * @private
         * @property    _currentLang
         * @type        String
         * @description Reference to the languege being used.
         */
        var _currentLang = _options.defaultLang;

        /**
         *
         * @property    _Namespace
         * @type        Object
         * @description Definition of the namespace that will have public access.
         */
        var _Namespace = {//--------------->> _Namespace

            /**
             *
             * @return      String
             * @description Retrieves the ID of the language that is being used.
             */
            getCurrentLang : function() {//--------------->> getCurrentLang()
                return _currentLang.toString();
            },//--------------->> End getCurrentLang()

            /**
             *
             * @param       langID String new language ID to be used.
             * @return      LangMessages
             * @throws      Error
             * @description Tries to stablish the language with the same ID as the
             *              current one.
             * @see         _getLangID
             */
            setCurrentLang : function( langID ) {//--------------->> setCurrentLang()
                _currentLang = _getLangID( langID );
                return this;
            },//--------------->> End setCurrentLang()

            /**
             *
             * @return      Object
             * @description Retrives the messages associated to the current languange.
             */
            getCurrentLangMessages : function() {//--------------->> getCurrentLangMessages()
                return _messages[ _currentLang ];
            },//--------------->> End getCurrentLangMessages()

            /**
             *
             * @param       langID String ID of the language to be consulted.
             * @return      Object
             * @throws      Error
             * @description Gets the messages associated to the language with the
             *              same ID as the received one.
             * @see         _getLangId
             */
            getLangMessages : function( langID ) {//--------------->> getLangMessages()
                return _messages[ _getLangID( langID ) ];
            },//--------------->> End getLangMessages()

            /**
             *
             * @param       messageID String ID of the message to be returned.
             * @return      String|Object
             * @throws      Error
             * @description Public method to retrieve the message with the same ID
             *              as the received param. If no message is found in the
             *              current language, it will be searched in the default one.
             */
            getMessage : function( messageID ) {//--------------->> getMessage()

                messageID = messageID.toString();
                var message = '';
                
                if( _messages[ _currentLang ].hasOwnProperty( messageID ) ) {//---------->> if message in _currentLang
                    message = _messages[ _currentLang ][ messageID ];
                } else if( _messages[ _options.defaultLang ].hasOwnProperty( messageID ) ) {//---------->> if message in _defaultLang
                    message = _messages[ _options.defaultLang ][ messageID ];
                } else {//---------->> else
                    throw new Error( 'No message with ID "' + messageID + '" was found' );
                }//---------->> End if

                return message;

            },//--------------->> End getMessage()

            /**
             *
             * @param       langID String ID of the language to be consulted.
             * @param       messageID String ID of the message to be returned.
             * @return      String
             * @throws      Error
             * @description Tries to retrieve a message by its ID and parent language
             *              ID.
             * @see         _getLangID
             */
            getLangMessage : function( langID, messageID ) {//--------------->> getLangMessage()

                var message = _messages[ _getLangID( langID ) ][ messageID.toString() ];

                if( message == null ) {//---------->> if message not exist

                    throw Error( "No message with ID \"" + messageID +
                                 "\" was found for the language with ID \"" + langID + "\"" );

                }//---------->> End if message not exist

                return message;

            }//--------------->> End getLangMessage()

        };//--------------->> End _Namespace

        /**
         *
         * @description Returning the internal namespace definition
         */
        return _Namespace;

    };//--------------->> End langMessages()

    /**
     *
     * @namespace   langMessages
     * @property    defauts
     * @type        Object
     * @description Default configuration of the plugin.
     */
    $.langMessages.defaults = {//--------------->> defaults
        defaultLang         : 'es',
        langMessagesPath    : 'js/messages/',
        langMessPrefix      : 'messages_',
        langMessExt         : 'json'
    };//--------------->> End defaults

} )( jQuery );//-------------------->> End jQuery Clousure