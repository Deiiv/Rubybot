/*
const winston = require("winston");
require("winston-daily-rotate-file");
const { format } = require("winston");
const { combine, timestamp, label, printf, errors } = format;

const customFormat = printf((info) => {
	if (info.stack) {
		return `${info.timestamp} [${info.label}] ${info.level} ${info.message} : ${info.stack}`;
	}
	return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

module.exports = winston.createLogger({
	level: "info",
	format: combine(errors({ stack: true }), label({ label: "Rubybot" }), timestamp(), customFormat),
	defaultMeta: { service: "user-service" },
	transports: [
		new winston.transports.DailyRotateFile({
			filename: "logs/rubybot-%DATE%.log",
			datePattern: "YYYY-MM-DD-HH",
			timestamp: true,
			maxSize: "10m",
			maxFiles: "5d",
		}),
	],
});
*/
function getLocalTimestamp() {
	const now = new Date();
	return now.toLocaleString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true
	});
}

var info = function (msg) {
	console.log(`[${getLocalTimestamp()}] [INFO]`, msg);
};

var error = function (error) {
	console.log(`[${getLocalTimestamp()}] [ERROR]`, error);
};

module.exports = {
	info: info,
	error: error,
};

// function logger() {
// 	this.info = function (msg) {
// 		console.log("[INFO22]", msg);
// 	}
// }
// module.exports.logger = logger;
