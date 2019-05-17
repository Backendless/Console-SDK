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
})
