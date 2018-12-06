const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
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

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const worker = workers.shift();
  console.log(worker);
  worker.send({
    type: "url",
    val: req.url,
  });

  workers.push(worker);
  res.end("");
});

server.listen(8000);