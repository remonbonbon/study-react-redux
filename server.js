#!/usr/bin/env node
'use strict'

var express = require('express');
var app = express();

app.use('/', express.static('./build'));

app.listen(3000, function() {
	console.log('Listening... http://0.0.0.0:3000/');
});
