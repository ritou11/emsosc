import React, { Component } from 'react';
import Highcharts from 'highcharts';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import HighchartsReact from './HC.jsx';
import './App.css';

const _ = require('lodash');

const { dialog } = window.require('electron').remote;
const { ipcRenderer } = window.require('electron');
let timer;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portText: '8888',
      listenState: 'IDLE',
      data: [],
      dataBuffer: [],
      updateChart: false,
    };
    ipcRenderer.on('toggle-listening', (event, listenState) => {
      if (listenState === 'IDLE' || listenState === 'LISTENING') this.setState({ listenState });
    });
    ipcRenderer.on('data', (event, data) => {
      const m = data.split(' ');
      // console.log(m);
      if (m && m.length > 1
        && _.isNumber(parseFloat(m[0]))
        && _.isNumber(parseFloat(m[1]))) this.addPoint(parseFloat(m[0]), parseFloat(m[1]));
      // console.log(data);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">A lite oscilloscope for debugging in EMS lab</h1>
        </header>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                zoomType: 'xy',
                height: 550,
              },
              title: {
                text: 'Network sent data',
              },
              xAxis: {
                type: 'time',
                min: 0,
                max: 1,
              },
              yAxis: {
                min: 0,
                max: 1,
              },
              legend: {
                enabled: false,
              },
              plotOptions: {
                scatter: {
                  marker: {
                    radius: 1,
                    fillColor: '#FF0000',
                  },
                },
              },
              series: [{
                id: 'only',
                type: 'scatter',
                data: this.state.data,
              }],
              tooltip: {
                enabled: false,
              },
            }}
            update={this.state.updateChart}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={this._handleLogin.bind(this)}>
          Msg
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this._addPoint.bind(this)}>
          Add
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={this._toggleListen.bind(this)}>
          TOGGLE
          </Button>
          <TextField
            id="state"
            label="State"
            value={this.state.listenState}
            margin="normal"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={this._refresh.bind(this)}>
          Refresh
          </Button>
          <TextField
            id="length"
            label="DataLength"
            value={this.state.data.length + this.state.dataBuffer.length}
            margin="normal"
          />
        </div>

      </div>
    );
  }

  addPoint(x, y) {
    this.setState((prevState) => ({
      dataBuffer: [...prevState.dataBuffer, [x, y]],
      updateChart: false,
    }));
  }

  _refresh() {
    if (this.state.dataBuffer.length > 0) {
      this.setState((prevState) => ({
        data: [...prevState.data, ...prevState.dataBuffer],
        dataBuffer: [],
        updateChart: true,
      }));
    }
  }

  _handleLogin() {
    const options = {
      type: 'info',
      buttons: ['确定'],
      title: '登录',
      message: 'haha',
      defaultId: 0,
      cancelId: 0,
    };
    dialog.showMessageBox(options);
  }

  _addPoint() {
    this.addPoint(Math.random(), Math.random());
    /* this.setState((prevState) => ({
      data: [...prevState.data, [Math.random(), Math.random()]],
    })); */
  }

  _toggleListen() {
    if (this.state.listenState !== 'ACTING') {
      if (this.state.listenState === 'IDLE') {
        timer = setInterval(() => {
          const p = Math.random();
          this.addPoint(p, Math.sqrt(1 - p * p) * Math.random());
        }, 10);
      } else {
        clearInterval(timer);
      }
      ipcRenderer.send('toggle-listening', parseInt(this.state.portText, 10) || 8888);
      this.setState({ listenState: 'ACTING' });
    }
  }
}

export default App;
