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

  loadTotalPoints(appId) {
    return req.get(`${urls.gamification(appId)}/total-points`)
  },

  loadEarnPointsItems(appId) {
    return req.get(`${urls.gamification(appId)}/earn-points`)
  },

  loadRedeemPointsItems(appId) {
    return req.get(`${urls.gamification(appId)}/redeem-points`)
  },

  loadPointsActivity(appId) {
    return req.get(`${urls.gamification(appId)}/points-activity`)
  },

  loadTutorial(url) {
    return req.get(url)
  }
})
