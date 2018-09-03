import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Chart from './Chart.jsx';
import './App.css';

const { ipcRenderer } = window.require('electron');

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
    ipcRenderer.on('data', (event, dataBuffer) => {
      dataBuffer.forEach((data) => {
        const { x, y } = data;
        this.addPoint(x, y);
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">A lite oscilloscope for debugging in EMS lab</h1>
        </header>
        <div>
          <Chart
            data={this.state.data}
            update={this.state.updateChart} />
        </div>
        <div>
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
            onClick={this._clearData.bind(this)}>
              Clear
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
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
      dataBuffer: [...prevState.dataBuffer, { x, y }],
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

  _clearData() {
    this.setState({
      data: [],
      dataBuffer: [],
      updateChart: true,
    });
  }

  _addPoint() {
    this.setState((prevState) => ({
      data: [...prevState.data, { x: Math.random(), y: Math.random() }],
      updateChart: true,
    }));
  }

  _toggleListen() {
    if (this.state.listenState !== 'ACTING') {
      if (this.state.listenState === 'IDLE') {
        /*
        timer = setInterval(() => {
          const p = Math.random();
          this.addPoint(p, Math.sqrt(1 - p * p) * Math.random());
        }, 10);
        */
      } else {
        /*
        clearInterval(timer);
        */
      }
      ipcRenderer.send('toggle-listening', parseInt(this.state.portText, 10) || 8888);
      this.setState({ listenState: 'ACTING' });
    }
  }
}

export default App;
