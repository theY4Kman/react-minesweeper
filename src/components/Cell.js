import React, { Component } from 'react'
import Flag from 'react-icons/lib/fa/flag'
import Bomb from 'react-icons/lib/fa/certificate'
import '../styles/Cell.css'

const baseStyle = {
  width: 32,
  height: 32,
  border: 'outset 4px white',
  lineHeight: '32px',
  userSelect: 'none'
};

const openStyle = {
  width: 38,
  height: 38,
  lineHeight: '38px',
  border: 'solid 1px darkgray'
};

const COLORS = {
  1: 'blue',
  2: 'green',
  3: 'red',
  4: 'navy',
  5: 'darkred',
  6: 'deepskyblue',
  7: 'navy',
  8: 'gray',
};

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(this.props.x, this.props.y);
  }

  handleDoubleClick(e) {
    e.preventDefault();
    this.props.onDoubleClick(this.props.x, this.props.y);
  }

  handleRightClick(e) {
    e.preventDefault();
    this.props.onRightClick(this.props.x, this.props.y);
  }

  render() {
    const { cell, cellSize } = this.props;
    const { bomb, bombCount, flagged, open } = cell;

    let content = flagged ? <Flag /> : '';
    let style = {
      ...baseStyle,
      width: cellSize - 8,
      height: cellSize - 8,
      lineHeight: `${cellSize - 8}px`,
    };

    if (open) {
      style = {
        ...style,
        ...openStyle,
        width: cellSize - 2,
        height: cellSize - 2,
        lineHeight: `${cellSize - 2}px`
      };

      if (bomb) {
        style = { ...style, backgroundColor: 'red' };
        content = <Bomb style={{ marginTop: -3 }} />;

      } else if (bombCount > 0) {
        style = { ...style, color: COLORS[bombCount] };
        content = bombCount;
      }
    }

    return (
      <div
        className="cell"
        style={style}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        onContextMenu={this.handleRightClick}
      >
        {content}
      </div>
    );
  }
}
