/**
 * Created by jonnyp on 06/05/2015.
 */

var keyMirror = require('keyMirror');

module.exports = {

    HttpRequestStates: keyMirror({
        REQUEST_PENDING:null,
        REQUEST_SUCCESS:null,
        REQUEST_TIMEOUT: null,
        REQUEST_UNAUTHORISED: null,
        REQUEST_BADREQUEST: null,
        REQUEST_ERROR: null
    }),
};