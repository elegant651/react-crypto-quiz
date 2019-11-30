import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import QuizBox from '../components/QuizBox';
import * as quizActions from '../store/modules/quiz'

class QuizContainer extends Component {
  async componentWillMount () {
    const { QuizActions } = this.props;

    await QuizActions.getQuiz();
  }
  
  render () {
    return (
      <div>        
        <QuizBox {...this.props} />        
      </div>
    );
  }
}


export default connect(
  (state) => ({
    meta: state.quiz
  }),
  (dispatch) => ({
    QuizActions: bindActionCreators(quizActions, dispatch)
  })  
)(QuizContainer);