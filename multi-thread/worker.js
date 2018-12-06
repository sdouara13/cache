// 处理缓存
const querystring = require("querystring");
const url = require("url");

console.log("thread create " + process.pid);

process.on("message", function(data) {
  // process.nextTick(function(){
    switch (data.type) {
      case "url":
        const query = querystring.parse(url.parse(data.val).query);
        const handle = new Promise((resolve => {
            resolve()
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
  // });
});