import React from 'react';

export default class ControllerButton extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {

  }

  style() {
    return({
      left: {
        float: 'left',
        width: '0',
        height: '0',
        marginLeft: '-15px',
        marginRight: '20px',
        borderTop: '15px solid transparent',
        borderRight: '25px solid #f00',
        borderBottom: '15px solid transparent',
        borderLeft: '25px solid transparent',
      },
      right: {
        float: 'left',
        width: '0',
        height: '0',
        borderTop: '15px solid transparent',
        borderRight: '25px solid transparent',
        borderBottom: '15px solid transparent',
        borderLeft: '25px solid #f00',
      },
      down: {
        width: '0',
        height: '0',
        marginLeft: '25px',
        borderTop: '20px solid #f00',
        borderRight: '20px solid transparent',
        borderBottom: '20px solid transparent',
        borderLeft: '20px solid transparent',
      },
      b: {
        float: 'right',
        backgroundColor: '#ff0000',
        borderRadius: '50%',
        height: '30px',
        width: '30px',
        textAlign: 'center',
        marginTop: '20px',
        marginLeft: '5px',
      },
      y: {
        float: 'right',
        backgroundColor: '#ff0000',
        borderRadius: '50%',
        height: '30px',
        width: '30px',
        textAlign: 'center',
      }
    })
  }

  render() {
    let style;
    if(this.props.position === 'left') {
      style = this.style().left;
    } else if(this.props.position === 'right') {
      style = this.style().right;
    } else if(this.props.position === 'down') {
      style = this.style().down;
    } else if(this.props.position === 'b') {
      style = this.style().b;
    } else if(this.props.position === 'y') {
      style = this.style().y;
    }
    let buttonText;
    if(this.props.position === 'b') {
      buttonText = 'B'
    } else if(this.props.position === 'y') {
      buttonText = 'Y'
    }
    return(
      <div style={style} onClick={this.handleClick}>{buttonText}</div>
    )
  }
}
