import React from 'react';
import ReactDom from 'react-dom';

import TopGrid from './poject_top_grid';

export default class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.topState;
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  styles() {
    return({
      defaultStyle: {
        height: '42px',
        white_space: 'pre-wrap',
      },
    })
  }

  componentWillReceiveProps(newProps) {
    if(newProps.keyAccept) {
      this.state = newProps.topState
    } else {
      this.setState({ color1: 0, color2: 0 });
    }
  }

  componentDidUpdate() {
    if(this.props.keyAccept) {
      document.addEventListener('keydown', this.onKeyDown);
    } else {
      document.removeEventListener('keydown', this.onKeyDown);
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e) {
    const column = this.state.column
    const position = this.state.position

    // right
    if(e.keyCode === 39 && column < 7) {
      if(column === 6 || position === 0 && column === 5) { return }
      this.setState({ column: column + 1 });

    // left
    } else if(e.keyCode === 37 && column > 0) {
      if(column === 0 || position === 2 && column === 1) { return }
      this.setState({ column: column - 1 });

    // x or up
    } else if(e.keyCode === 88 || e.keyCode === 38) {
      if(position === 3 && column === 0 || position === 1 && column === 6) { return }
      this.setState({
        position: position === 0 ? 3 : position - 1,
      });

    // z
    } else if(e.keyCode === 90 || e.keyCode === 38) {
      if(position === 3 && column === 6 || position === 1 && column === 0) { return }
      this.setState({
        position: position === 3 ? 0 : position + 1
      });

    // down
    } else if(e.keyCode === 40) {
      this.props.handleDown(this.state);
    }
  }

  render() {
    const column = this.state.column
    const key = new Date().getTime();

    return(
      <div style={this.styles().defaultStyle}>
        <TopGrid key={'1'+key} topGridState={this.state} position='1' />
        <TopGrid key={'2'+key} topGridState={this.state} position='2' />
      </div>
    )
  }
}
