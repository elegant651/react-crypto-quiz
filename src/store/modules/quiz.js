import { Map, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';
import { generateQuiz } from '../../utils/quizGenerator';

const getQuizAPI = () => {
  return axios.get('https://api.binance.vision/api/glossaries')
}

const GET_QUIZ_SUCCESS = "GET_QUIZ_SUCCESS";
const GET_QUIZ_FAILURE = "GET_QUIZ_FAILURE";

const NEXT_QUESTION = "NEXT_QUESTION";
const SCORE = "SCORE";
const RESULTS = "RESULTS";

export const getQuiz = () => dispatch => {
  return getQuizAPI().then(
    (response) => {
      dispatch({
        type: GET_QUIZ_SUCCESS,
        payload: response
      })
    }
  ).catch(error => {
    dispatch({
      type: GET_QUIZ_FAILURE,
      payload: error
    })
    throw(error)
  })
}

export const nextQuestion = createAction(NEXT_QUESTION);
export const addScore = createAction(SCORE);
export const viewResults = createAction(RESULTS);

const initialState = Map({
  error: false,
  score: 0,
  index: 0,
  currentQuiz: null,
  data: List(),
  total: 10
});

export default handleActions({
  [GET_QUIZ_SUCCESS]: (state = initialState, action) => {
    const list = action.payload.data;
    
    const genList = generateQuiz(list);    
    
    return state
      .set('score', 0)
      .set('index', 0)
      .set('data', genList)
      .set('currentQuiz', genList[0]);
  },
  [GET_QUIZ_FAILURE]: (state, action) => {
    return state
      .update('error', true);    
  },
  [NEXT_QUESTION]: (state, action) => {
    const index = state.get('index') + 1;
    const currentQuiz = state.get('data')[index];
    
    return state
      .update('index', () => index)
      .update('currentQuiz', () => currentQuiz);
  },
  [SCORE]: (state, action) => {
    return state.update('score', score => score + 1);
  },
  [RESULTS]: (state, action) => {
    return state.update('index', index => index + 1);
  }
}, initialState)
