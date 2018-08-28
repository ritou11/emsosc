const net = require('net');

const client = net.connect(8888, 'localhost', () => {
  setInterval(() => client.write(`${Math.random()} ${Math.random()}`), 10);
});
