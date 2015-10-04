//require('newrelic');
var	Redis = require('ioredis');
var nR = require("node-resque");
var host = 'localhost:9200';
var mongodb = 'mongodb://localhost/Project';
// global.redisClient = redis.createClient(6379, "127.0.0.1", {});
global.redisClient = new Redis({
	port: 6379,          // Redis port
	host: '127.0.0.1'
});
global.connectionDetails = {
	redis: redisClient
};
new Promise(function(resolve,reject) {
	global.Resque = new nR.queue({connection: connectionDetails}, "");
	Resque.connect(resolve);
}).then(function() { 
	Resque.enqueue('development', 'increment', [1]);
});
