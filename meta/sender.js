const net = require('net');

let cnt = 0;
const client = net.connect(8888, 'localhost', () => {
  setInterval(() => {
    if (cnt > 5000) {
      client.end();
      clearInterval();
    }
    cnt += 1;
    const p = Math.random();
    client.write(`${p} ${Math.random() * Math.sqrt(1 - p * p)}`);
  }, 10);
});
