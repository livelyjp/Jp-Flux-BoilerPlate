/**
 * Created by jonnyp on 06/05/2015.
 */
var AppConstants = require('../Constants/AppConstants');
var AppDispatcher = require('../Dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppActions = AppConstants.AppActions;
var RequestStates = AppConstants.HttpRequestStates;
var CHANGE_EVENT = 'REFERRAL_STORE_CHANGE';

var _myCollection = {};

function _addItem(item){
    if(!_myCollection[item.id]) {
        _myCollection[item.id] = item;
    }
}

var GenericStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        console.log("Referral Store Emit Change");
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        console.log("Referral Store Add Change Listener");
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        console.log("Referral Store Remove Change Listener");
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _myCollection[id];
    },

    getAll: function() {
        return _myCollection;
    }
});

GenericStore.dispatchToken = AppDispatcher.register(function(action) {
    console.log("Generic Store Action Received: " + action.type);

    switch(action.type) {

        case AppActions.MY_CONSTANT:

            console.log("Generic Store MY_CONSTANT In Process");
            _addItem(action.response.body);
            GenericStore.emitChange();
            break;

        default:
            console.log("Generic Store: Action " + action.type + " Not Handled");
    }
});

module.exports = GenericStore;
