import React, { Component } from 'react';
import {
  FlexibleXYPlot,
  MarkSeries,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis';
import '../node_modules/react-vis/dist/style.css';

class Chart extends Component {
  shouldComponentUpdate(nextProps) {
    const { update } = nextProps;
    return typeof (update) === 'undefined' || update;
  }

  render() {
    return (
      <FlexibleXYPlot
        height={600}
        xDomain={[0, 1]}
        yDomain={[0, 1]}>
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis />
        <YAxis />
        <MarkSeries
          data={this.props.data}
          color="red"
          size={1}
        />
      </FlexibleXYPlot>
    );
  }
}

export default Chart;
