/*

Function used to log in a proper format and to a file.

Details:
- This forces logs to have a standard format, including the log timestamps
- Because it logs to a file, we can export it to AWS CloudWatch for easy log filtering and retention
- If this is not used, the logs are only kept for a short amount of time and are hard to visualize
- Applies a rotation policy on the files to ensure space doesn't run out
- Rotation in local memory is fine because we retain in CloudWatch for a longer period

*/

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
