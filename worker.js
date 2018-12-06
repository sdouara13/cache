// 处理缓存
const http = require('http');
const querystring = require("querystring");
const url = require("url");
const redis = require("redis");
const {promisify} = require('util');
const config = require('./config/db');

const client = redis.createClient(config);
const getAsync = promisify(client.get).bind(client);
const setnxAsync = promisify(client.setnx).bind(client);

console.log("创建线程 " + process.pid);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const query = querystring.parse(url.parse(req.url).query);
  console.log(`线程${process.pid} 处理当前任务`);
  Object.keys(query).forEach((val) => {
    setnxAsync(val, query[val])
      .then(res => {
        // console.log(`存储值 ${val}: ${query[val]}`)
      })
      .catch(err => {
        // console.error(`存储值 ${val}: ${query[val]} 失败`)
      })

  })
  res.end("");
});

server.listen(8000);