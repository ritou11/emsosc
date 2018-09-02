import React, { PureComponent } from 'react';


class HighchartsReact extends PureComponent {
  componentDidMount() {
    const p = this.props;
    const highcharts = p.highcharts || window.Highcharts;
    const constructorType = p.constructorType || 'chart';
    // Create chart
    this.chart = highcharts[constructorType](this.container, Object.assign({}, p.options));
  }

  shouldComponentUpdate(nextProps) {
    const { update } = nextProps;
    // Update if not specified or set to true
    return (typeof update === 'undefined') || update;
  }

  componentDidUpdate() {
    this.chart.update(Object.assign({}, this.props.options), true, !(this.props.oneToOne === false));
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    const containerProps = this.props.containerProps || {};
    containerProps.ref = (container) => { this.container = container; };

    // Create container for our chart
    return React.createElement('div', containerProps);
  }
}

export default HighchartsReact;
