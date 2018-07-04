import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bomb from 'react-icons/lib/fa/certificate'
import Board from './Board'
import config from '../config'
import { toggle, init, changeDifficulty, gameover, clear } from '../actions'
import '../styles/Game.css'

class Game extends Component {
  constructor(props) {
    super(props);
    const { difficulty } = this.props;
    this.state = { board: this.initBoard(difficulty) };
    this.handleClick = this.handleClick.bind(this);
    this.handleClickCell = this.handleClickCell.bind(this);
    this.handleRightClickCell = this.handleRightClickCell.bind(this);
    this.handleDoubleClickCell = this.handleDoubleClickCell.bind(this)
  }

  initBoard(difficulty) {
    const bombPlaces = this.initBombPlaces(difficulty);
    const { boardWidth, boardHeight } = config[difficulty];
    const board = Array.from(
      new Array(boardWidth), () => new Array(boardHeight).fill(
        { bomb: false, bombCount: 0, open: false, flagged: false }
      )
    );
    for (let place of bombPlaces) {
      board[place.x][place.y] = Object.assign({}, board[place.x][place.y], { bomb: true })
    }
    return board
  }

  initBombPlaces(difficulty) {
    const bombPlaces = [];
    const { boardWidth, boardHeight, bombNum } = config[difficulty];

    while (bombPlaces.length < bombNum) {
      const x = Math.floor(Math.random() * boardWidth);
      const y = Math.floor(Math.random() * boardHeight);
      if (bombPlaces.length === 0) {
        bombPlaces.push({ x: x, y: y })
      } else {
        const duplicated = bombPlaces.filter((place) => {
          return place.x === x && place.y === y
        }).length > 0;
        if (!duplicated) {
          bombPlaces.push({ x: x, y: y })
        }
      }
    }
    return bombPlaces
  }

  handleClick(e) {
    e.preventDefault();
    const { difficulty } = this.props;
    this.props.dispatch(init());
    this.setState({ board: this.initBoard(difficulty) })
  }

  handleClickCell(x, y) {
    const { gameover, clear } = this.props;
    if (gameover || clear) {
      return
    }
    this.open(x, y)
  }

  handleRightClickCell(x, y) {
    const { gameover, clear } = this.props;
    if (gameover || clear) {
      return
    } else {

        this.toggleFlag(x, y)
    }
  }

  handleDoubleClickCell(x, y) {
    const { gameover, clear, difficulty } = this.props;
    const { boardWidth, boardHeight } = config[difficulty];
    const { board } = this.state;
    if (gameover || clear) {
      return
    }
    if (!board[x][y].open) {
      return
    }

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ((i < 0 || i >= boardWidth) ||
            (j < 0 || j >= boardHeight) ||
            (i === x && j === y) ||
            (board[i][j].flagged)) {
          continue
        }
        this.open(i, j)
      }
    }
  }

  changeDifficulty(e) {
    const difficulty = e.target.value;
    this.props.dispatch(changeDifficulty(difficulty));
    this.setState({ board: this.initBoard(difficulty) })
  }

  open(x, y) {
    const board = [].concat(this.state.board);
    const cell = board[x][y];
    const { boardWidth, boardHeight } = config[this.props.difficulty];

    if (!cell.open) {
      let bombCount = 0;

      for (let i=x - 1; i<=x + 1; i++) {
        for (let j=y - 1; j<=y + 1; j++) {
          if ((i < 0 || i >= boardWidth) ||
              (j < 0 || j >= boardHeight) ||
              (i === x && j === y)) {
            continue
          }
          if (board[i][j].bomb) {
            bombCount++
          }
        }
      }

      board[x][y] = { ...cell, open: true, bombCount: bombCount };
      this.setState({ board });

      if (cell.flagged) {
        this.toggleFlag(x, y)
      }
      if (cell.bomb) {
        this.props.dispatch(gameover())
      }
      if (this.isClear(board)) {
        this.props.dispatch(clear())
      }

      if (bombCount === 0 && !cell.bomb) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if ((i < 0 || i >= boardWidth) ||
                (j < 0 || j >= boardHeight) ||
                (i === x && j === y) ||
                (board[i][j].flagged)) {
              continue
            }
            this.open(i, j)
          }
        }
      }
    }
  }

  isClear(board) {
    let openCount = 0;
    const { difficulty } = this.props;
    const { boardWidth, boardHeight, bombNum } = config[difficulty];
    board.forEach((row, i) => {
      row.forEach((cell, i) => {
        if (cell.open) {
          openCount++
        }
      })
    });
    return openCount === (boardWidth * boardHeight - bombNum)
  }

  toggleFlag(x, y) {
    const board = [].concat(this.state.board);
    const cell = board[x][y];
    const { flagged } = cell;

    board[x][y] = { ...cell, flagged: !flagged };
    this.setState({ board });
    this.props.dispatch(toggle(!flagged))
  }

  render() {
    const { board } = this.state;
    const { difficulty, gameover, clear, bomb } = this.props;
    const { boardWidth, cellSize } = config[difficulty];
    const boardWidthPx = boardWidth * cellSize;

    let status = <span className="status" />;
    if (gameover) {
      status = <span id="gameover" className="status">Gameover</span>
    } else if (clear) {
      status = <span id="clear" className="status">Clear!</span>
    }
    return (
      <div id="game" style={{ width: boardWidthPx }}>
        <h1>Minesweeper</h1>
        <div id="menu">
          <button onClick={this.handleClick} id="restart">Restart</button>
          <select value={difficulty} onChange={(e) => this.changeDifficulty(e)} style={{ marginRight: 5 }}>
            <option value={'easy'} key={'easy'}>Easy</option>
            <option value={'normal'} key={'normal'}>Normal</option>
            <option value={'hard'} key={'hard'}>Hard</option>
            <option value={'veryHard'} key={'veryHard'}>Very Hard</option>
            <option value={'maniac'} key={'maniac'}>Maniac</option>
          </select>
          <span id="bomb"><Bomb style={{ marginTop: -3 }} /> {bomb}</span>
          {status}
        </div>
        <Board
          board={board}
          cellSize={cellSize}
          onClick={this.handleClickCell}
          onRightClick={this.handleRightClickCell}
          onDoubleClick={this.handleDoubleClickCell}
        />
        <div>
          <p>
            <span style={{ fontWeight: 'bold' }}>HOW TO PLAY</span><br />
            <span style={{ fontSize: 14 }}>Click: Open a cell.</span><br />
            <span style={{ fontSize: 14 }}>Right Click: Toggle a flag.</span><br />
            <span style={{ fontSize: 14 }}>Double Click: Open cells around open cell except flagged at once. Only enable for open cell.</span>
          </p>
          <hr />
          <p style={{ textAlign: 'right' }}>
            <span>Created by </span>
            <a href="https://github.com/saitoxu">Yosuke Saito</a>
            <br />
            <span>View </span>
            <a href="https://github.com/saitoxu/react-minesweeper">Code</a>
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state.game;

export default connect(mapStateToProps)(Game)
