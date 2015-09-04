var settings = require('../settings');

var mongodb = require('mongodb');

var db = mongodb.Db;

var connection = mongodb.Connection;

var server = mongodb.Server; 

module.exports = new db(settings.db, new server(settings.host, settings.port),{safe: true});