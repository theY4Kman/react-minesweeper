import React, { Component } from 'react'
import Cell from './Cell'

export default class Row extends Component {
  render() {
    const { row } = this.props;

    return (
      <div>
        {row.map((cell, i) =>
          <Cell
            key={i}
            cell={cell}
            x={this.props.x}
            y={i}
            cellSize={this.props.cellSize}
            onClick={this.props.onClick}
            onRightClick={this.props.onRightClick}
            onDoubleClick={this.props.onDoubleClick}
          />
        )}
      </div>
    )
  }
}
