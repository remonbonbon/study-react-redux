'use strict';

import { createStore, bindActionCreators, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLoggerMiddleware from 'redux-logger'
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

//--------- Actions ---------
const Actions = {
	now: (time)=> {
		return {
			type: 'NOW',
			time: time,
		};
	},
};

// --------- Reducers ---------
function timeReducer(state = 0, action) {
	switch (action.type) {
	case 'NOW':
		return {
			value: action.time,
			stamp: new Date(action.time).toISOString().replace('T', ' ').substr(0, 23),
		};
	default:
		return state;
	}
}
const rootReducer = combineReducers({
	time: timeReducer
});

//--------- Store ---------
const createStoreWithMiddleware = applyMiddleware(
	thunkMiddleware,
	createLoggerMiddleware()
)(createStore);
const initialState = rootReducer({}, Actions.now(Date.now()));
const store = createStoreWithMiddleware(rootReducer, initialState);

//--------- View (React) ---------
class TimerApp extends Component {
	render() {
		const { timestamp } = this.props;
		return (
			<p>
				<span style={ {fontFamily: 'monospace', fontSize: '20pt'} }>
					{timestamp}
				</span>
			</p>
		);
	}

	componentWillMount() {
		setInterval(()=> {
			this.props.now(Date.now());
		}, 500);
	}
}
TimerApp.propTypes = {
	now: PropTypes.func.isRequired,
	timestamp: PropTypes.string.isRequired,
};
const App = connect(
	(state)=> {
		return {
			timestamp: state.time.stamp
		};
	},
	(dispatch)=> bindActionCreators(Actions, dispatch)
)(TimerApp);


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
