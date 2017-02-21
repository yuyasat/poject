import React from 'react';

export default class ControllerButton extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    if(this.props.position === 'down') {
      this.props.handleDown({ keyCode: 40 });
    } else if(this.props.position === 'left') {
      this.props.handleLeft({ keyCode: 37 });
    } else if(this.props.position === 'right') {
      this.props.handleRight({ keyCode: 39 });
    } else if(this.props.position === 'b') {
      this.props.handleB({ keyCode: 88 });
    } else if(this.props.position === 'y') {
      this.props.handleY({ keyCode: 90 });
    }
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
        borderRight: '25px solid #bdbdbd',
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
        borderLeft: '25px solid #bdbdbd',
      },
      down: {
        width: '0',
        height: '0',
        marginLeft: '25px',
        borderTop: '20px solid #bdbdbd',
        borderRight: '20px solid transparent',
        borderBottom: '20px solid transparent',
        borderLeft: '20px solid transparent',
      },
      b: {
        float: 'right',
        backgroundColor: '#facc2e',
        borderRadius: '50%',
        height: '30px',
        width: '30px',
        textAlign: 'center',
        marginTop: '20px',
        marginLeft: '5px',
      },
      y: {
        float: 'right',
        backgroundColor: '#04b431',
        borderRadius: '50%',
        height: '30px',
        width: '30px',
        textAlign: 'center',
      }
    })
  }

  render() {
    const style = {
      left: this.style().left, right: this.style().right, down: this.style().down,
      b: this.style().b, y: this.style().y
    }[this.props.position]

    return(
      <div style={style} onClick={this.handleClick} />
    )
  }
}
