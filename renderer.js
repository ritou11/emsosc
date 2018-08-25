const Highcharts = require('highcharts');
const net = require('net');
require('highcharts/modules/exporting')(Highcharts);

const listenPort = 8888;

const server = new net.createServer();

const textArea = document.getElementById('textArea');
const listenBtn = document.getElementById('listenBtn');

let btnState = false;
const clients = [];

server.on('connection', (socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    textArea.value = textArea.value.concat(data);
  });
  socket.on('close', () => {
    console.log('Closed');
  });
  clients.push(socket);
});

listenBtn.addEventListener('click', () => {
  console.log('Click');
  if (btnState) {
    server.close();
    clients.forEach((c) => { c.destroy(); });
    clients.forEach(() => { clients.pop(); });
    listenBtn.innerHTML = 'Listen';
    btnState = false;
  } else {
    console.log('listening');
    server.listen(listenPort);
    listenBtn.innerHTML = 'ing';
    btnState = true;
  }
});

const chart = Highcharts.chart('container', {
  chart: {
    zoomType: 'xy',
  },
  title: {
    text: 'Network sent data',
  },
  xAxis: {
    type: 'time',
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    area: {
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      threshold: null,
    },
  },
  series: [{
    id: 'only',
    type: 'line',
    data: [{ x: 1.5, y: 2 }, { x: 2, y: 3 }],
  }],
});

const series = chart.get('only');
series.addPoint([1, 1], true, false);
