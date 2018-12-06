// 处理缓存
const querystring = require("querystring");
const url = require("url");

console.log("process create " + process.pid);

process.on("message", function(data) {
  process.nextTick(function(){
    switch (data.type) {
      case "url":
        const query = querystring.parse(url.parse(data.val).query);
        // console.log("Cache processing in the process " + process.pid, query);
        const handle = new Promise((resolve => {
          setTimeout(() => {
            resolve()
          }, 0);
        }));
        handle.then(() => {
          process.send({
            pid: process.pid,
            seqNo: data.seqno
          })
        });
        break;
      default:break;
    }
  });
});