/**
 *
 * StringJSON.js
 * @author      Julio Mora <julio@ingeniagroup.com>
 * @version     1.0
 * @description String object plugin to use JSON validations.
 */
( function() {//-------------------->> Clousure

    var _jsonFilter = /[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/;

    /**
     *
     * @return      Boolean
     * @description Evaluates if the String represents a JSON expression.
     */
    String.prototype.isJSON = function() {//--------------->> isJSON()
        return ( _jsonFilter.test( this.replace( /"(\\.|[^"\\])*"/g, '' ) ) );
    }//--------------->> End isJSON()

    /**
     *
     * @param       securityExpression
     * @return      Object
     * @throws      Error
     * @throws      SyntaxError
     * @description Gets a JSON Object since this String instance value.
     * @see         String.prototype.isJSON
     */
    String.prototype.parseJSON = function( securityExpression ) {//--------------->> parseJSON()

        securityExpression = securityExpression || 'for(;;);';
        var _jsonObject = null;
        var _jsonExpression = this.replace( securityExpression.toString(), '' );

        if( !_jsonExpression.isJSON() ) {//---------->> if not JSON
            throw new Error( "Invalid JSON format" );
        }//---------->> End if not JSON

        try {//---------->> try
            _jsonObject = eval( '(' + _jsonExpression + ')' );
        } catch ( err ) {//---------->> catch
            throw new SyntaxError( "Error Parsing JSON format: " + err.message );
        }//---------->> End try/catch

        return _jsonObject;

    };//--------------->> End parseJSON()

} )();//-------------------->> Clousure
