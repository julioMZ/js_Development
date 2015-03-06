/**
 *
 * init.js
 * @author      Julio Mora <julio@ingeniagroup.com>
 * @description Initialization of page functionality.
 * @see         LangMessages.js
 */
$( document ).ready( function() {//-------------------->> ready()
    
    var messages = jQuery.langMessages();
    var selectElement = $( '#lang' );

    $( '#lang' ).bind( 'change', function( e ) {//--------------->> change()

        try {//---------->> try
            
            var messagesList = messages.getLangMessages( selectElement.val() );
            
            document.title = messagesList.title;
            $( 'h1' ).text( messagesList.title );
            $( 'legend' ).text( messagesList.legend );
            $( 'label' ).text( messagesList.label + ': ' );
            $( 'option[value=\'es\']' ).text( messagesList.es );
            $( 'option[value=\'en\']' ).text( messagesList.en );
            $( 'option[value=\'fr\']' ).text( messagesList.fr );
            $( '#showMessageButton' ).text( messagesList.button );
            
        } catch( err ) {//---------->> catch
            alert( err.message );
        }//---------->> End try/catch

    } );//--------------->> End change()

} );//-------------------->> End ready()
