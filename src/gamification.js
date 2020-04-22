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

  loadMissions() {
    return req.get(`${urls.gamification()}/missions`)
  },

  loadBalance() {
    return req.get(`${urls.gamification()}/balance`)
  },

  loadActivityHistory() {
    return req.get(`${urls.gamification()}/activity-history`)
  },

  loadTutorial(url) {
    return req.get(url)
  },

  loadTrivia() {
    return req.get(`${urls.gamification()}/trivia`)
  },

  checkTriviaAnswer(triviaId, answerId, taskId) {
    return req.post(`${urls.gamification()}/trivia`, { triviaId, answerId, taskId })
  },

  submitSocialSharing(data) {
    return req.post(`${urls.gamification()}/bonus`, data)
  },

  loadBadges() {
    return req.get(`${urls.gamification()}/badges`)
  },

  reportSocialActivity(appId, data) {
    return req.post(`${urls.gamification()}/social-activity-link`, data)
  },

  getLastUpdates() {
    return req.get(`${urls.gamification()}/updates`)
  }
})
