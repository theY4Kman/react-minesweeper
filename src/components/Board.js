import React, { Component } from 'react'
import Row from './Row'
import '../styles/Board.css'

export default class Board extends Component {
  render() {
    const { board, cellSize, onClick, onRightClick, onDoubleClick } = this.props;

    return (
      <div className="board">
        {board.map((row, i) =>
          <Row
            key={i}
            row={row}
            x={i}
            cellSize={cellSize}
            onClick={onClick}
            onRightClick={onRightClick}
            onDoubleClick={onDoubleClick}
          />
        )}
      </div>
    )
  }
}
