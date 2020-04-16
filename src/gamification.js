import urls from './urls'

export default req => ({
  loadTracks(appId) {
    return req.get(`${urls.gamification(appId)}/tracks`)
  },

  loadMilestones(appId) {
    return req.get(`${urls.gamification(appId)}/milestones`)
  },

  loadMissions(appId) {
    return req.get(`${urls.gamification(appId)}/missions`)
  },

  loadTotalBB(appId) {
    return req.get(`${urls.gamification(appId)}/total-bb`)
  },

  loadEarnBBItems(appId) {
    return req.get(`${urls.gamification(appId)}/earn-bb`)
  },

  loadRedeemBBItems(appId) {
    return req.get(`${urls.gamification(appId)}/redeem-bb`)
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
