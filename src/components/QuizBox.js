import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import './QuizBox.css';
import Timer from './Timer'

class QuizBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      selection: null,
      answer: null
    }
  }

  handleAnswer = (select, solution) => {
    if(select === solution) {      
      this.setState({
        answer: true,
        selection: null
      })      
    } else {
      this.setState({
        answer: false,
        selection: null
      })
    }
  }

  nextQuestion = () => {
    const { meta, QuizActions } = this.props;
    const index = meta.get('index');
    const totalQuestions = meta.get('total');    

    if (this.state.answer) QuizActions.addScore();
    if(index+1 < totalQuestions) {
      QuizActions.nextQuestion();

      this.setState({
        answer: null,
        selection: null
      });
    } else {      
      QuizActions.viewResults();
      this.setState({ complete: true });
    }
  }

  finishQuiz = async () => {
    this.setState({
      complete: false,
      selection: null,
      answer: null
    })

    const { QuizActions } = this.props;
    await QuizActions.getQuiz();
  }

  render() {
    const { selection, answer, complete } = this.state;
    const { meta } = this.props;    

    const currentQuiz = meta.get('currentQuiz');
    const score = meta.get('score');
    const index = meta.get('index');
    const totalQuestions = meta.get('total');
    const progw = (index+1)*100/totalQuestions
    const shareMsg = `${score} score out of ${totalQuestions} questions`

    const renderClassName = (i) => {
	  return (selection === i)
	    ? `choice selected`
	    : `choice`;
	};
    
    if (currentQuiz) {
      return (
        <div className="QuizBox">
          <Timer options={{prefix: 'seconds elapsed!', delay: 100}} isComplete={complete}  />
          <div className='scoreWrap'>
            Score: {score}
          </div>

          <ProgressBar now={progw} />
          {!complete && currentQuiz &&
            <div className='quizHeader'>
              <h3>Q {index + 1} / {totalQuestions}</h3>          
              <h2>{currentQuiz.excerpt}</h2>
            </div>
          }

          {!complete && currentQuiz.choices.map((choice, idx) => {
            const key = (choice + idx);
            
            if (answer === null) {
              return (
                <div
                  key={key}
                  className={renderClassName(idx)}
                  onClick={() => this.handleAnswer(idx, currentQuiz.solution)}>
                  <p>{choice}</p>
                </div>
              )
            } else if (answer) {
              if (currentQuiz.solution === idx) {
                return (
                  <div
                    key={key}                    
                    className='choice correct'>
                    <p>{choice}</p>
                  </div>
                )
              } else {
                return (
                  <div
                    key={key}                    
                    className='choice wrong'>
                    <p>{choice}</p>
                  </div>
                )
              }
            }
          })}

          {answer !== null && !complete &&
            <div className='messageDiv'>
              {answer
                ? <h1 className='correctAnswer'>Correct!</h1>
                : <h1 className='wrongAnswer'>Wrong!</h1>}
                {answer !== null && !answer && (
                  <div className='explanation'>
                    <p>Right Answer:</p>
                    <h3>{currentQuiz.title}</h3>
                  </div>
                )}

                {index + 1 === totalQuestions
                  ? <button onClick={this.nextQuestion}>View Results</button>
                  : <button onClick={this.nextQuestion}>Next Question</button>}
              </div>}

          {complete && 
            <div className='score'>
              <h1>
                Score: {score} out of {totalQuestions} questions
              </h1>
              
              <button onClick={this.finishQuiz}>Try Again!</button>
            </div>
          }
        </div>
      );
    } else {
      return null;
    }
    
  }
  
};

export default QuizBox;
