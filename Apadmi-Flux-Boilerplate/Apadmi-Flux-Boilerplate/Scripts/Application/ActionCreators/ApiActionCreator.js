/**
 * Created by jonnyp on 06/05/2015.
 */

var ActionDispatcher = require('./ActionDispatcher');
var AppConstants = require('../Constants/AppConstants');

var RequestConstants = AppConstants.HttpRequestStates;

function _dispatchAction(requestKey, requestStatus, params, response){
    ActionDispatcher.dispatchApiAction(requestKey, requestStatus, params, response);
}

module.exports = {
    dispatchPendingAction:  function (requestKey, params) {
        console.log("Pending " + requestKey );
        _dispatchAction(requestKey, RequestConstants.REQUEST_PENDING, params, {});
    },

    dispatchTimeoutAction: function (requestKey, params){
        console.log("Timeout " + requestKey );
        _dispatchAction(requestKey, RequestConstants.REQUEST_TIMEOUT, params, {});
    },

    dispatchUnauthorisedAction: function (requestKey, params, response) {
        console.log("Unauthorised " + requestKey );
        _dispatchAction(requestKey, RequestConstants.REQUEST_UNAUTHORISED, params, response);
    },

    dispatchBadRequest: function (requestKey, params, response){
        console.log("Bad Request " + requestKey );
        _dispatchAction(requestKey, RequestConstants.REQUEST_BADREQUEST, params, response);
    },

    dispatchSuccessAction: function (requestKey, params, response){
        console.log("Success " + requestKey );
        _dispatchAction(requestKey, RequestConstants.REQUEST_SUCCESS, params, response);
    }
};


