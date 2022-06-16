import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
              value={this.props.squares[i]}
              onClick = {() => this.props.onClick(i)}
              />;
  }

  render() {
    if(this.props.squares){
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        xIsNext: Math.random() > 0.5,
      }],
      stepNumber: 0,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) == null && squares[i] == null){
      squares[i] = current.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          xIsNext: !current.xIsNext,
        }]),
        stepNumber: history.length,
      });
    }
  }

  jumpTo(step){
    const newHistory = this.state.history.slice(0, step + 1);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      history: newHistory,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.slice(0, -1).map((step, move) => {
      const targetStep = history.length - move - 2;
      return(
        <div key = {move}className = 'GoButtonContainer'>
          <button
          onClick={() => this.jumpTo(targetStep)}
          className = 'GoButton'
          id = {this.state.stepNumber === move ? 'current' : null}
          >
            <Board 
              squares = {history[targetStep].squares}
              onClick = {() => {}}
            />
          </button>
        </div>
      );
    });

    let status;
    if(winner)
      status = 'Winner:\n' + winner;
    else
      status = 'Next player:\n' + (current.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <h1 className='title'>Tic Tac Toe</h1>
        <div className='game-info status'>{status}</div>
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => (this.handleClick(i))}
          />
        </div>
        <div className="game-info">
          <div className='GoButtonsContainer'>{moves}</div>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
  