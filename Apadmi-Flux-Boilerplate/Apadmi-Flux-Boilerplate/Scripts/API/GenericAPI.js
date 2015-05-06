/**
 * Created by jonnyp on 06/05/2015.
 */

var AppConstants = require('../Constants/AppConstants');
var ApiActionCreator = require('../Actions/ApiActionCreator');
var RequestAgent = require('superagent');

var API_URL = 'http://localhost:63151/api/State';
var TIMEOUT = 10000;
var ExampleKey = AppConstants.AppActions.MY_CONSTANT;

var _pendingRequests = {};

function _abortPendingRequests(requestKey){
    if (_pendingRequests[requestKey]) {
        _pendingRequests[requestKey]._callback = function(){};
        _pendingRequests[requestKey].abort();
        _pendingRequests[requestKey] = null;
        console.log("Canceled Request For " + requestKey)
    }
}

function _processRequestEvent(requestKey, params) {
    console.log("End");
    return function (err, res) {
        if (err && err.timeout === TIMEOUT) {
            ApiActionCreator.dispatchTimeoutAction(requestKey, params);
        }
        else if (res.status === 400) {
            ApiActionCreator.dispatchUnauthorisedAction(requestKey, params, res);
        }
        else if (!res.ok) {
            ApiActionCreator.dispatchBadRequest(requestKey,params, res);
        }
        else {
            ApiActionCreator.dispatchSuccessAction(requestKey, params, res);
        }
    };
}

function _createGetRequest(url) {
    return RequestAgent
        .get(url)
        .timeout(TIMEOUT)
}

function _getRequest() {
    console.log("Starting Referral Poll");
    _abortPendingRequests(ExampleKey);
    ApiActionCreator.dispatchPendingAction(ExampleKey, "");
    _pendingRequests[ExampleKey] = _createGetRequest(API_URL).end(
        _processRequestEvent(ExampleKey)
    );
}

var ReferralApi = {
    getRequest:function(){
        _getRequest()
    }
};

module.exports = ReferralApi;