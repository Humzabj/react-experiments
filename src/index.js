import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// class Square extends React.Component {
//   // Controlled component due to it's complete reliance on the Board component
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => { this.props.onClick() }}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  /*
  Converted to Function component. 
  If a component only has the render method and no other methods or state 
  it is better to convert them to Function Components
  */
  /* 
  props.onClick is now fed directly into the onClick function instead of
  () => {this.props.onClick()} as their is no local variable environment to 
  inject data form.
  ****************** NOTE ****************** 
  Remember not to pass props.onClick() with the bracket because that sets 
  up an infinite loop which will raise an error
  */ 
    return (
      <button
        className="square"
        onClick={ props.onClick }
      >
        { props.value }
      </button>
    );
}

class Board extends React.Component {
  /*
  Constructor removed because now the Game component is handling the state and passing 
  the props.
  */
  // constructor(props) {
  //   // Must call super constructor to reference props from parent with this keyword
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   }
  // }

  renderSquare(i) {
    return (
      <Square
        value={ this.props.squares[i] }
        onClick={() => { this.props.onClick(i)}}
      />
    );
  }

  render() {
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  clickHandler(i) {
    // Creating a shallow copy for immutability with slice() method
    /* 
      Immutability allows us to keep track of changes made to the data.
      This can help in implementing functions that detect changes in data e.g. undo.
      We can also use the manipulated data to trigger re-rendering as per the business 
      logic (i.e pure components, look at shouldComponentUpdate() funciton).
    */ 
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // Current move will always be the last index of history
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // The click returns null if the game has been won of the board has been filled.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // The .concat() method does not mutate the original array like the .push() method does.
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    // xIsNext is set depending on the turn being even or odd
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    /* 
    The current stepNumber now determines the rendering of the board.
    This allows the user to navigate between different turns.
    */
    /* 
    **Deprecated**
    Current move will always be the last index of history
    const current = history[history.length - 1];
    */
    const current = history[this.state.stepNumber];
    // Winner will be decided on current move
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
      'Go to move #' + move : 
      'Go to game start';
      return (
        <li key={ move }>
          <button onClick={() => this.jumpTo(move)}>{ desc }</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          {/* Passing props to board. The clickHandler is now in Game component. */}
          <Board
            squares={current.squares}
            onClick={(i) => this.clickHandler(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// default angular getting started function
// TODO: make your own algorithm.
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


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
