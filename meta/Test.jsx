import React, { PureComponent, Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './App.css';

import { highlightUpdates } from 'react-highlight-updates';

highlightUpdates();

class Label extends PureComponent {
  render() {
    return (
      <div>
        <h1>
          {this.props.name}
        </h1>
      </div>
    );
  }
}

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCnt: 0,
    };
  }

  render() {
    return (
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={this._refresh.bind(this)}>
        Refresh
        </Button>
        <TextField
          id="length"
          label="DataLength"
          value={`${this.state.dataCnt}`}
          margin="normal"
        />
        <TextField
          id="test"
          label="Test"
          value={`${5}`}
          margin="normal"
        />
        <div>
          <Label name="12345"/>
        </div>


      </div>
    );
  }

  _refresh() {
    this.setState({ dataCnt: Math.random() });
  }
}

export default Test;
