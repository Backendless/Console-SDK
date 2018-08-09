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
    return req.delete(urls.messagingPushTemplates(appId)).query({ names: pushTemplateNames.join(',') })
  },

  createPushSchedule(appId, scheduledPush) {
    return req.post(urls.messagingPushSchedules(appId), scheduledPush)
  },

  updatePushSchedule(appId, scheduledPushName, scheduledPush) {
    return req.put(urls.messagingPushSchedule(appId, scheduledPushName), scheduledPush)
  },

  deletePushSchedules(appId, scheduledPushNames) {
    return req.delete(urls.messagingPushSchedules(appId), { names: scheduledPushNames })
  },

  getPushRecipientsCount(appId, where) {
    return req.get(urls.messagingPushRecipientsCount(appId)).query({ where })
  },

  sendPush(appId, push) {
    return req.post(urls.messagingPush(appId), push)
  },

  getPushButtonTemplates(appId, platform) {
    return req.get(urls.messagingPushButtonTemplates(appId)).query({ platform })
  },

  savePushButtonTemplate(appId, templateData, platform) {
    return req.put(urls.messagingPushButtonTemplates(appId), templateData).query({ platform })
  },

  deletePushButtonTemplate(appId, templateName, platform) {
    return req.delete(urls.messagingPushButtonTemplate(appId, templateName)).query({ platform })
  },

  getPushChannelTemplates(appId, platform) {
    return req.get(urls.messagingPushChannelTemplates(appId)).query({ platform })
  },

  savePushChannelTemplate(appId, templateData, platform) {
    return req.put(urls.messagingPushChannelTemplates(appId), templateData).query({ platform })
  },

  deletePushChannelTemplate(appId, templateName, platform) {
    return req.delete(urls.messagingPushChannelTemplate(appId, templateName)).query({ platform })
  },

})
