module.exports = {
  apps : [{
    name   : "Rubybot",
    script : "./index.js",
    error_file : "./pm2/pm2_logs.log",
    out_file : "./pm2/pm2_logs.log"
  }]
}
