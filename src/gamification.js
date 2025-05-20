import urls from './urls'

export default req => ({
  loadPacks() {
    return req.get(`${urls.gamification()}/packs`)
  },

  getMapItems(packId) {
    return req.get(`${urls.gamification()}/map-items`).query({ packId })
  },

  getProgress() {
    return req.get(`${urls.gamification()}/progress`)
  },

  loadLevels() {
    return req.get(`${urls.gamification()}/levels`)
  },

  loadBadges() {
    return req.get(`${urls.gamification()}/badges`)
  },

  loadEarnBBItems() {
    return req.get(`${urls.gamification()}/earn`)
  },

  loadRedeemBBItems() {
    return req.get(`${urls.gamification()}/redeem`)
  },

  loadActivityHistory() {
    return req.get(`${urls.gamification()}/activity-history`)
  },

  loadTrivia() {
    return req.get(`${urls.gamification()}/trivia`)
  },

  checkTriviaAnswer(triviaId, answerId, taskId) {
    return req.post(`${urls.gamification()}/trivia`, { triviaId, answerId, taskId })
  },

  submitSocialSharing(data) {
    return req.post(`${urls.gamification()}/social-share`, data)
  },

  reportSocialActivity(data) {
    return req.post(`${urls.gamification()}/social-link`, data)
  },

  getUnnotifiedEvents() {
    return req.get(`${urls.gamification()}/unnotified-events`)
  },

  getUnnotifiedAchievements() {
    return req.get(`${urls.gamification()}/unnotified-achievements`)
  },

  markEventPlayed(taskId) {
    return req.put(`${urls.gamification()}/mark-event-played`, { taskId })
  },

  isAppAPITrackingEnabled(appId) {
    return req.get(`${urls.gamificationApp(appId)}/enabled`)
  },

  getFreeMilestoneProgress() {
    return req.get(`${urls.gamification()}/free-plan-milestone-progress`)
  },

  getSettings() {
    return req.get(`${urls.gamification()}/settings`)
  },

  saveSettings(settings) {
    return req.put(`${urls.gamification()}/settings`, settings)
  },

  getSocialPostsCollection() {
    return req.get(`${urls.gamification()}/social-posts-templates`)
  },

  validateFlowRunnerAchievements(appId, event) {
    return req.post(`/api/gamification/${appId}/flowrunner-achievements/validate`, event)
  }
})
