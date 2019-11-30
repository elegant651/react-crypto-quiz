import React, { Component } from 'react';

import './App.css';
import QuizContainer from './containers/QuizContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <QuizContainer />
      </div>
    );
  }
}

export default App;
