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
  props.onClick() is now fed directly into the onClick function instead of
  () => {this.props.onClick()} as their is no local variable environment to 
  inject data form.
  */ 
    return (
      <button
        className="square"
        onClick={ props.onClick() }
      >
        { props.value }
      </button>
    );
}

class Board extends React.Component {
  constructor(props) {
    // Must call super constructor to reference props from parent with this keyword
    super(props);
    this.state = {
      squares: Array(9).fill(null)
    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => { this.clickHandler(i)}}
      />
    );
  }

  clickHandler(i) {
    // Creating a shallow copy for immutability
    /* 
      Immutability allows us to keep track of changes made to the data.
      This can help is implementing functions that detect changes in data e.g. undo.
      We can also use the manipulated data to trigger re-rendering as per the business 
      logic (i.e pure components, look at shouldComponentUpdate() funciton).
    */ 
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  render() {
    const status = 'Next player: X';
    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
