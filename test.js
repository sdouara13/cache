const request = require('request');

for(let i = 0; i < 1000; i ++) {
  request.get(`http://localhost:8000/?${(''+Math.random()* 1000).substr(0, 5)}=a&${(''+Math.random()* 1162).substr(0, 5)}=b`, function(err,httpResponse,body) {
  });
}

