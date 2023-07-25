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

  getLastUpdates() {
    return req.get(`${urls.gamification()}/updates`)
  },

  markEventPlayed(taskId) {
    return req.put(`${urls.gamification()}/mark-event-played`, { taskId })
  },

  enableAPITracking(appId) {
    return req.put(`${urls.gamificationApiTracking(appId)}/enable`)
  },

  disableAPITracking(appId) {
    return req.put(`${urls.gamificationApiTracking(appId)}/disable`)
  },

  isAPITrackingEnabled(appId) {
    return req.get(`${urls.gamificationApiTracking(appId)}/enabled`)
  },

  unlockSpringboardPlan(appId) {
    return req.put(`${urls.gamification()}/unlock-springboard`).query({ appId })
  },

  getFreeMilestoneProgress() {
    return req.get(`${urls.gamification()}/free-plan-milestone-progress`)
  },

  getUnlockedFreePlanAppId() {
    return req.get(`${urls.gamification()}/free-plan-status`)
  },

  getSettings() {
    return req.get(`${urls.gamification()}/settings`)
  },

  saveSettings(settings) {
    return req.put(`${urls.gamification()}/settings`, settings)
  },

  getSocialPostsCollection() {
    return req.get(`${urls.gamification()}/social-posts-templates`)
  }
})
