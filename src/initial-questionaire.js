import { prepareRoutes } from './utils/routes'

const routes = prepareRoutes({
  questions: '/console/community/initial-questionaire/questions'
})

export const initialQuestionaire = req => ({
  loadQuestions() {
    return req.community.get(routes.questions())
  }
})
