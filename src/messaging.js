import urls from './urls'
import totalRows from './utils/total-rows'
import { CHANNEL_DEVICES } from './utils/cache-tags'

// This method is needed in perspective (c) Arthur Dzidoiev
const enrichChannelWithSettings = (channel = {}) => ({
  ...channel,
  settings: {
    polling  : true,
    rtmp     : 0,
    websocket: 8888
  }
})

export default req => ({
  loadChannels(appId) {
    return req.get(urls.messagingChannels(appId))
  },

  createChannel(appId, channelName) {
    const channel = enrichChannelWithSettings({ name: channelName })

    return req.post(urls.messagingChannels(appId), channel)
  },

  renameChannel(appId, oldChannel, newName) {
    const channel = enrichChannelWithSettings(oldChannel)
    channel.name = newName

    return req.put(urls.messagingChannel(appId, channel.channelid), channel)
  },

  deleteChannel(appId, channelId) {
    return req.delete(urls.messagingChannel(appId, channelId))
      .cacheTags(CHANNEL_DEVICES(channelId))
  },

  loadDevices(appId, channelId, params) {
    const dataReq = req.get(`${urls.messagingChannel(appId, channelId)}/devices`)
      .query(params)
      .cacheTags(CHANNEL_DEVICES(channelId))

    return totalRows(req).getWithData(dataReq)
  },

  deleteDevices(appId, channelId, devicesIds) {
    return req.delete(`${urls.messagingChannel(appId, channelId)}/devices`, devicesIds)
      .cacheTags(CHANNEL_DEVICES(channelId))
  },

  loadMessages(appId, channelId, params) {
    const dataReq = req.get(`${urls.messagingChannel(appId, channelId)}/messages`).query(params)

    //disable caching for count request
    return totalRows(req).getWithData(dataReq, 0)
  },

  // TODO: change after server fix: BKNDLSS-13298
  publishMessage(appId, channelName, params) {
    return req.post(`${urls.messaging(appId)}/${channelName}`, params)
  },

  getMessagingChannels(appId) {
    return req.get(`${urls.messaging(appId)}/channels`)
  },

  getPushTemplates(appId) {
    return req.get(urls.messagingPushTemplates(appId))
  },

  createPushTemplate(appId, pushTemplate) {
    return req.post(urls.messagingPushTemplates(appId), pushTemplate)
  },

  updatePushTemplate(appId, pushTemplateName, pushTemplate) {
    return req.put(urls.messagingPushTemplate(appId, pushTemplateName), pushTemplate)
  },

  getPushTemplate(appId, pushTemplateName) {
    return req.get(urls.messagingPushTemplate(appId, pushTemplateName))
  },

  deletePushTemplates(appId, pushTemplateNames) {
    return req.delete(urls.messagingPushTemplates(appId)).query({ names: pushTemplateNames })
  },

  getScheduledPushes(appId) {
    return req.get(urls.messagingScheduledPushes(appId))
  },

  createScheduledPush(appId, scheduledPush) {
    return req.post(urls.messagingScheduledPushes(appId), scheduledPush)
  },

  updateScheduledPush(appId, scheduledPushName, scheduledPush) {
    return req.put(urls.messagingScheduledPush(appId, scheduledPushName), scheduledPush)
  },

  deleteScheduledPushes(appId, scheduledPushNames) {
    return req.delete(urls.messagingScheduledPushes(appId)).query({ names: scheduledPushNames })
  },

  createPushSchedule(appId, scheduledPush) {
    return req.post(urls.messagingPushSchedules(appId), scheduledPush)
  },

  updatePushSchedule(appId, scheduledPushName, scheduledPush) {
    return req.put(urls.messagingPushSchedule(appId, scheduledPushName), scheduledPush)
  },

  restorePushSchedule(appId, scheduledPushName) {
    return req.post(urls.messagingPushSchedule(appId, scheduledPushName))
  },

  deletePushSchedules(appId, scheduledPushNames) {
    return req.delete(urls.messagingPushSchedules(appId), { names: scheduledPushNames })
  },

  getScheduledPush(appId, scheduledPushName) {
    return req.get(urls.messagingScheduledPush(appId, scheduledPushName))
  },

  getPushRecipientsCount(appId, where) {
    return req.get(urls.messagingPushRecipientsCount(appId)).query({ where })
  },

  sendPush(appId, push) {
    return req.post(urls.messagingPush(appId), push)
  },

  getLayoutTemplates(appId, platform) {
    return req.get(`${urls.messaging(appId)}/buttontemplates`).query({ platform })
  },

  saveLayoutTemplate(appId, templateData, platform) {
    return req.put(`${urls.messaging(appId)}/buttontemplates`, templateData).query({ platform })
  },

  deleteLayoutTemplate(appId, templateName, platform) {
    return req.delete(`${urls.messaging(appId)}/buttontemplates/${templateName}`).query({ platform })
  },

})
