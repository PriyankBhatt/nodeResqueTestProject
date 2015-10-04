var consolelog = function(count , callback) {
	setTimeout(function () {
 		callback(null, "DONE");
	}, 6000);
}
module.exports = consolelog;