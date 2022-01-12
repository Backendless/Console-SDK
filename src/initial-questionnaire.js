import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  questions: '/console/community/initial-questionnaire/questions',
  answers  : '/console/community/initial-questionnaire/answers'
})

export const initialQuestionnaire = req => ({
  loadQuestions() {
    return req.community.get(routes.questions())
  },
  sendAnswers(answers) {
    return req.community.post(routes.answers(), answers)
  }
})
