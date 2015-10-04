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
	var jobs = {
		"increment": {
			perform: function(count, callback) {
				require('./Jobs/Increment')(count, callback);		
			}				
		},
		"consolelog": {
			perform: function(count, callback) {
				require('./Jobs/consolelog')(count, callback);
			}
		}
	};
	Resque.cleanOldWorkers(5000, function(err, data) {
		console.log("Cleanning Worker");
	});
	var scheduler = new nR.scheduler({connection: connectionDetails});
	scheduler.connect(function(){
		scheduler.start();
	});
	var multiWorker = new nR.multiWorker({connection: connectionDetails, queues: ['development']}, jobs);
	multiWorker.on('job',               function(workerId, queue, job){          console.log("worker["+workerId+"] working job " + queue + " " + JSON.stringify(job)); });
	multiWorker.on('failure',           function(workerId, queue, job, failure){ console.log("worker["+workerId+"] job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); });
	multiWorker.on('success',           function(workerId, queue, job, result){  console.log("worker["+workerId+"] job success " + queue + " " + JSON.stringify(job) + " >> " + result); });
	multiWorker.start();
	Resque.enqueue('development', 'increment', [1]);
	process.on('SIGINT', function(){
	  multiWorker.stop(function(){
	    scheduler.end(function() {
	  		process.exit(0);
	 	 });
	  });
	});
});
