module.exports = {
    apps : [{
      name: "System-info",
      script: "./main.js",
      log_file: "./logs/logs.log",
      max_memory_restart : "120M",
      exec_mode: "cluster"      
    }]
}