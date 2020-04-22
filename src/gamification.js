import urls from './urls'

export default req => ({
  loadTracks() {
    return req.get(`${urls.gamification()}/tracks`)
  },

  loadMilestones() {
    return req.get(`${urls.gamification()}/milestones`)
  },

  loadLevels() {
    return req.get(`${urls.gamification()}/levels`)
  },

  loadEarnBBItems() {
    return req.get(`${urls.gamification()}/earn`)
  },

  loadRedeemBBItems() {
    return req.get(`${urls.gamification()}/redeem`)
  },

  loadMissions(appId) {
    return req.get(`${urls.gamification(appId)}/missions`)
  },

  loadBalance(appId) {
    return req.get(`${urls.gamification(appId)}/balance`)
  },

  loadActivityHistory(appId) {
    return req.get(`${urls.gamification(appId)}/activity-history`)
  },

  loadTutorial(url) {
    return req.get(url)
  },

  loadTrivia(appId) {
    return req.get(`${urls.gamification(appId)}/trivia`)
  },

  checkTriviaAnswer(appId, triviaId, answerId, taskId) {
    return req.post(`${urls.gamification(appId)}/trivia`, { triviaId, answerId, taskId })
  },

  submitSocialSharing(appId, data) {
    return req.post(`${urls.gamification(appId)}/bonus`, data)
  },

  loadBadges(appId, devId) {
    return req.get(`${urls.gamification(appId)}/badges`).query({ devId })
  },

  reportSocialActivity(appId, data) {
    return req.post(`${urls.gamification(appId)}/social-activity-link`, data)
  },

  getLastUpdates(appId, devId) {
    return req.get(`${urls.gamification(appId)}/updates`).query({ devId })
  }
})
