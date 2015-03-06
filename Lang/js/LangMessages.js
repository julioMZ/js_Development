/**
 *
 * LangMessages.js
 * @param       defaultLang String Default language ID.
 * @throws      Error
 * @return      Object
 * @description Module to dispatch messages strings according to a requested
 *              language.
 */
var LangMessages = ( function( defaultLang ) {//-------------------->> LangMessages

    /**
     *
     * @private
     * @property    _messages
     * @type        Object
     * @description Messages map grouped by language ID.
     */
    var _messages = {//--------------->> _messages

        /**
         *
         * @property    es
         * @type        Object
         * @description Spanish messages
         */
        es : {//---------->> es

            hello       : "Hola",
            bye         : "Adiós",
            test        : "Prueba",
            seeYou      : "Hasta pronto",
            thanks      : "Gracias",
            esMessage   : "Este es un mensaje que sólo se utiliza en español"

        },//---------->> End es

        /**
         *
         * @property    en
         * @type        Object
         * @description English messages
         */
        en : {//---------->> en

            hello       : "Hello",
            bye         : "Bye",
            test        : "Test",
            seeYou      : "See you",
            thanks      : "Thank you",
            enMessage   : "This is a message that is only used in English language"

        },//---------->> End en

        /**
         *
         * @property    fr
         * @type        Object
         * @description French messages
         */
        fr : {//---------->> fr

            hello       : "Bonjour",
            bye         : "Aurevoir",
            test        : "Épreuve",
            seeYou      : "A bientôt",
            thanks      : "Merci",
            frMessage   : "Ceci est un message qui est utilisé uniquement en français"

        }//---------->> End fr

    };//--------------->> End _messages

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

        if( !_messages.hasOwnProperty( langID ) ) {//---------->> if lang is not registered
            throw Error( 'The language ' + _defaultLang + ' is not a valid one' );
        }//---------->> End if lang is not registered

        return langID;

    };//--------------->> End _getLangID()

    /**
     *
     * @private
     * @property    _defaultLang
     * @type        String
     * @description Refrence to the Module's default language.
     */
     var _defaultLang = _getLangID( defaultLang );

    /**
     *
     * @private
     * @property    _currentLang
     * @type        String
     * @description Reference to the languege being used.
     */
     var _currentLang = _defaultLang;

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
         * @return      String
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
            } else if( _messages[ _defaultLang ].hasOwnProperty( messageID ) ) {//---------->> if message in _defaultLang
                message = _messages[ _defaultLang ][ messageID ];
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

} )( 'es' );//-------------------->> End LangMessages