import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  questions: '/console/community/initial-questionnaire/questions',
  answers  : '/console/community/initial-questionnaire/answers',
  status   : '/console/community/initial-questionnaire/status',
})

export const initialQuestionnaire = req => ({
  loadQuestions() {
    return req.community.get(routes.questions())
  },

  sendAnswers(answers) {
    return req.community.post(routes.answers(), answers)
  },

  loadStatus() {
    return req.community.get(routes.status())
  }
})
