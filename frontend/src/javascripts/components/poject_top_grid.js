import React from 'react';
import ReactDom from 'react-dom';

import { defaultColors } from '../modules/poject_styles.js';

export default class TopGrid extends React.Component {
  styles() {
    return(
      Object.assign(
        {
          defaultStyle: {
            position: 'absolute',
            width: '30px',
            height: '20px',
            white_space: 'pre-wrap',
          },
          upper:  { top: '70px' },
          middle: { top: '91px' },
          lower:  { top: '112px' },
          col0:   { left: '8px' },
          col1:   { left: '40px' },
          col2:   { left: '72px' },
          col3:   { left: '104px' },
          col4:   { left: '136px' },
          col5:   { left: '168px' },
          col6:   { left: '200px' },
          red:    { background: '#ff0000' },
          blue:   { background: '#0000ff' },
          green:  { background: '#00ff00' },
          yellow: { background: '#ffff00' },
        },
        defaultColors()
      )
    );
  }

  render() {
    const styles = this.styles();
    const position = this.props.position
    const topGridState = this.props.topGridState
    let style;
    if(position === '1') { // 1の場合は縦方向には動かさない
      if(topGridState.column === 0) {
        style = Object.assign(styles.defaultStyle, styles.middle, styles.col0)
      } else if(topGridState.column === 1) {
        style = Object.assign(styles.defaultStyle, styles.middle, styles.col1)
      } else if(topGridState.column === 2) {
        style = Object.assign(styles.defaultStyle, styles.middle, styles.col2)
      } else if(topGridState.column === 3) {
        style = Object.assign(styles.defaultStyle, styles.middle, styles.col3)
      } else if(topGridState.column === 4) {
        style = Object.assign(styles.defaultStyle, styles.middle, styles.col4)
      } else if(topGridState.column === 5) {
        style = Object.assign(styles.defaultStyle, styles.middle, styles.col5)
      } else if(topGridState.column === 6) {
        style = Object.assign(styles.defaultStyle, styles.middle, styles.col6)
      }
      if(topGridState.color1 === 1) {
        style = Object.assign(style, styles.red)
      } else if(topGridState.color1 === 2) {
        style = Object.assign(style, styles.blue)
      } else if(topGridState.color1 === 3) {
        style = Object.assign(style, styles.green)
      } else if(topGridState.color1 === 4) {
        style = Object.assign(style, styles.yellow)
      }
    } else {
      if(topGridState.column === 0) {
        if(topGridState.position === 0) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col1)
        } else if(topGridState.position === 1) {
          style = Object.assign(styles.defaultStyle, styles.upper, styles.col0)
        } else if(topGridState.position === 3) {
          style = Object.assign(styles.defaultStyle, styles.lower, styles.col0)
        }
      } else if(topGridState.column === 1) {
        if(topGridState.position === 0) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col2)
        } else if(topGridState.position === 1) {
          style = Object.assign(styles.defaultStyle, styles.upper, styles.col1)
        } else if(topGridState.position === 2) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col0)
        } else if(topGridState.position === 3) {
          style = Object.assign(styles.defaultStyle, styles.lower, styles.col1)
        }
      } else if(topGridState.column === 2) {
        if(topGridState.position === 0) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col3)
        } else if(topGridState.position === 1) {
          style = Object.assign(styles.defaultStyle, styles.upper, styles.col2)
        } else if(topGridState.position === 2) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col1)
        } else if(topGridState.position === 3) {
          style = Object.assign(styles.defaultStyle, styles.lower, styles.col2)
        }
      } else if(topGridState.column === 3) {
        if(topGridState.position === 0) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col4)
        } else if(topGridState.position === 1) {
          style = Object.assign(styles.defaultStyle, styles.upper, styles.col3)
        } else if(topGridState.position === 2) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col2)
        } else if(topGridState.position === 3) {
          style = Object.assign(styles.defaultStyle, styles.lower, styles.col3)
        }
      } else if(topGridState.column === 4) {
        if(topGridState.position === 0) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col5)
        } else if(topGridState.position === 1) {
          style = Object.assign(styles.defaultStyle, styles.upper, styles.col4)
        } else if(topGridState.position === 2) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col3)
        } else if(topGridState.position === 3) {
          style = Object.assign(styles.defaultStyle, styles.lower, styles.col4)
        }
      } else if(topGridState.column === 5) {
        if(topGridState.position === 0) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col6)
        } else if(topGridState.position === 1) {
          style = Object.assign(styles.defaultStyle, styles.upper, styles.col5)
        } else if(topGridState.position === 2) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col4)
        } else if(topGridState.position === 3) {
          style = Object.assign(styles.defaultStyle, styles.lower, styles.col5)
        }
      } else if(topGridState.column === 6) {
        if(topGridState.position === 1) {
          style = Object.assign(styles.defaultStyle, styles.upper, styles.col6)
        } else if(topGridState.position === 2) {
          style = Object.assign(styles.defaultStyle, styles.middle, styles.col5)
        } else if(topGridState.position === 3) {
          style = Object.assign(styles.defaultStyle, styles.lower, styles.col6)
        }
      }
      if(topGridState.color2 === 1) {
        style = Object.assign(style, styles.red)
      } else if(topGridState.color2 === 2) {
        style = Object.assign(style, styles.blue)
      } else if(topGridState.color2 === 3) {
        style = Object.assign(style, styles.green)
      } else if(topGridState.color2 === 4) {
        style = Object.assign(style, styles.yellow)
      }
    }

    return(
      <div style={style} />
    )
  }
}
