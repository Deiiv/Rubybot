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
