const cluster = require('cluster');
const child_process = require('child_process');
const os = require('os');
const platform = os.platform();
const numCPUs = os.cpus().length;
const workers = [];
let worker;

cluster.setupMaster({
  exec: 'worker.js',
  silent: false // 是否输出到控制台
});
cluster.on('message', (worker, message, handle) => {

})

for (let i = 0; i < numCPUs; i++) {
  worker = cluster.fork();
  workers.push(worker);
  cluster.on('exit', (worker, code, signal) => console.log(`[Master]# Worker ${worker.id} died.`));
}

if (platform === 'linux') {
  for (let i = 0; i < numCPUs; i++) {
    child_process.exec(`taskset -pc ${workers[i].process.pid} ${i + 1}`);
    console.log(`绑定线程 ${workers[i].process.pid} 到CPU内核 ${i + 1}`)
  }
}