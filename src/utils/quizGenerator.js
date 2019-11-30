
const shuffle = (array) => {
  return array.sort(() => {
    return Math.random() - Math.random()
  })
}

const getChoices = (list, quiz) => {
  const solution = Math.floor(Math.random()*4)
  const answer = quiz.title;

  let arrChoices = []
  let newList = list.filter(q => q.id !== quiz.id)
  for(let i=0; i<4; i++) {
    const pickIdx = Math.floor(Math.random()*newList.length);
    arrChoices.push(newList[pickIdx].title);
    newList.splice(pickIdx, 1);
  }

  arrChoices[solution] = answer;

  return {solution, arrChoices}
}

export const generateQuiz = (data) => {
  const list = shuffle(data);
  
  return list.slice(0, 10).map((quiz) => {
    const {solution, arrChoices} = getChoices(list, quiz);
    quiz.choices = arrChoices
    quiz.solution = solution
    return quiz
  })  
}