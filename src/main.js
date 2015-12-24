import { createStore, bindActionCreators, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLoggerMiddleware from 'redux-logger'
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

//--------- Actions ---------
const Actions = {
	increment: ()=> {
		return {
			type: 'INCREMENT'
		};
	},
	decrement: ()=> {
		return {
			type: 'DECREMENT'
		};
	},
	incrementAsync: ()=> {
		// redux-thunk allows async dispatch.
		return (dispatch)=> {
			setTimeout(()=> {
				dispatch(Actions.increment());
			}, 1000);
		};
	},
};

// --------- Reducers ---------
function counterReducer(state = 0, action) {
	switch (action.type) {
	case 'INCREMENT':
		return state + 1;
	case 'DECREMENT':
		return state - 1;
	default:
		return state;
	}
}
const rootReducer = combineReducers({
	counter: counterReducer
});

//--------- Store ---------
const createStoreWithMiddleware = applyMiddleware(
	thunkMiddleware,
	createLoggerMiddleware()
)(createStore);
const initialState = {
	counter: 100,
};
const store = createStoreWithMiddleware(rootReducer, initialState);

//--------- View (React) ---------
class CounterApp extends Component {
	render() {
		const { increment, incrementAsync, decrement, counter } = this.props;
		return (
			<p>
				Clicked: {counter} times
				{' '}
				<button onClick={increment}>+</button>
				{' '}
				<button onClick={incrementAsync}>+ async</button>
				{' '}
				<button onClick={decrement}>-</button>
			</p>
		);
	}
}
CounterApp.propTypes = {
	increment: PropTypes.func.isRequired,
	incrementAsync: PropTypes.func.isRequired,
	decrement: PropTypes.func.isRequired,
	counter: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
	return {
		counter: state.counter
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}
const App = connect(mapStateToProps, mapDispatchToProps)(CounterApp);


ReactDOM.render(
	<Provider store={store}>
		<App></App>
	</Provider>,
	document.getElementById('root')
);
