/**
 * Created by jonnyp on 06/05/2015.
 */

var AppDispatcher = require('../Dispatcher/AppDispatcher');

function _dispatch(action){
    console.log("Dispatching Action: " + action.type);
    AppDispatcher.dispatch(action);
}

module.exports = {
    dispatchApiAction: function(type, requestStatus, params, response){
        _dispatch({
            type: type,
            requestStatus: requestStatus,
            params: params,
            response: response
        })
    },
    dispatchEventAction: function(type, data){
        _dispatch({
            type: type,
            data: data
        })
    }
}
