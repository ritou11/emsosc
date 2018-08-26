import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import './App.css';

const { dialog } = window.require('electron').remote;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
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
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={this._handleLogin.bind(this)}>
          Hello World
        </Button>
      </div>
    );
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

    dialog.showMessageBox(options, (res) => {
      if (res === 0) {
        console.log('OK pressed!');
      }
    });
  }
}

export default App;
