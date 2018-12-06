const numCPUs = require('os').cpus().length;
const http = require('http');
const childProcess = require('child_process');
const workers = [];

let worker;
let count = 0;
let count2 = 0;
let startTime = {};
let sumTime = 0;
let sumTime2 = 0;
let seqno = 0;
for (let i = 0; i < numCPUs; i++) {
  worker = childProcess.fork('worker.js', ['normal'])
  workers.push(worker);
  worker.on('message', ({ pid, seqNo }) => {

    // console.log('Master Received message from worker: ' + pid);
    count ++;
    sumTime += (Date.now() - startTime[pid][seqNo]) / 1000;
    if (count === 100) {
      console.log('Comsume time', sumTime);
      count = 0;
      sumTime = 0;
      seqno = 0;
      startTime = {};
    }
  })
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const worker = workers.shift();
  // console.log('Send request param to child process', worker.pid);
  worker.send({
    type: "url",
    val: req.url,
    seqno
  });
  if (!startTime[worker.pid]) {
    startTime[worker.pid] = {}
  }
  startTime[worker.pid][seqno] = Date.now();
  seqno++;
  workers.push(worker);
  res.end("");
});

server.listen(8000);


const querystring = require("querystring");
const url = require("url");
const serverTest = http.createServer((req, res) => {

  const startTime2 = Date.now();

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const query = querystring.parse(url.parse(req.url).query);
  const handle = new Promise((resolve => {
    setTimeout(() => {
      resolve()
    }, 0);
  }));
  handle.then(() => {
    count2++;
    // console.log("Cache processing in the process ");
    sumTime2 += (Date.now() - startTime2) / 1000;
    if (count2 === 100) {
      console.log('Comsume time2', sumTime2);
      count2 = 0;
      sumTime2 = 0;
    }
  });
  res.end("");
});

serverTest.listen(8001);