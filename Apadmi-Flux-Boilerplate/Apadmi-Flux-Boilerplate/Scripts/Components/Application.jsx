var React = require('react');
var GenericStore = require('../Stores/GenericStore');

function getStoreData(){
    return({
        data: GenericStore.getAll()
    });
}

var Application = React.createClass({

    getInitialState: function() {
        return getStoreData();
    },

    componentDidMount: function() {
        GenericStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        GenericStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getStoreData());
    },

    render: function () {
        return (
            <div>
                <h1>Hello World</h1>
                {
                    this.data.map(function(item){
                        return <div>item.id</div>
                    })
                }
            </div>
        );
    }
});

React.render(<Application />, document.getElementById('main'))
