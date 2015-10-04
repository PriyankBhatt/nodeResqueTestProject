var increment = function(count, callback) {
	var i;
	for (i=0;i<=14;i++) {
		Resque.enqueue('development', 'consolelog',[++count]);
	}
	callback(null, "DONE");
}
module.exports = increment;