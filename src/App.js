import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './App.css';

const _ = require('lodash');

const { dialog } = window.require('electron').remote;
const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portText: '8888',
      listenState: 'IDLE',
      chart: Highcharts,
      options: {
        chart: {
          zoomType: 'xy',
          width: 800,
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
          data: [],
        }],
      },
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
            highcharts={this.state.chart}
            options={this.state.options}
          />
        </div>
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
      </div>
    );
  }

  addPoint(x, y) {
    this.setState((prevState) => prevState.options.series[0].data.push([x, y]));
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
    this.setState((prevState) => prevState.options.series[0].data.push([Math.random(), Math.random()]));
  }

  _toggleListen() {
    if (this.state.listenState !== 'ACTING') {
      ipcRenderer.send('toggle-listening', parseInt(this.state.portText, 10) || 8888);
      this.setState({ listenState: 'ACTING' });
    }
  }
}

export default App;
