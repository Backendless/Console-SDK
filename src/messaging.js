/* eslint-disable max-len */

import urls from './urls'
import totalRows from './utils/total-rows'
import { CHANNEL_DEVICES } from './utils/cache-tags'
import BaseService from './base/base-service'

// This method is needed in perspective (c) Arthur Dzidoiev
const enrichChannelWithSettings = channel => ({
  ...channel,
  settings: {
    polling  : true,
    rtmp     : 0,
    websocket: 8888
  }
})

class Messaging extends BaseService {
  constructor(req) {
    super(req)
    this.serviceName = 'messaging'
  }

  loadChannels(appId) {
    return this.req.get(urls.messagingChannels(appId))
  }

  createChannel(appId, channelName) {
    const channel = enrichChannelWithSettings({ name: channelName })

    return this.req.post(urls.messagingChannels(appId), channel)
  }

  renameChannel(appId, oldChannel, newName) {
    const channel = enrichChannelWithSettings(oldChannel)
    channel.name = newName

    return this.req.put(urls.messagingChannel(appId, channel.channelid), channel)
  }

  deleteChannel(appId, channelId) {
    return this.req.delete(urls.messagingChannel(appId, channelId))
      .cacheTags(CHANNEL_DEVICES(channelId))
  }

  loadDevices(appId, channelId, params) {
    const dataReq = this.req.get(`${urls.messagingChannel(appId, channelId)}/devices`)
      .query(params)
      .cacheTags(CHANNEL_DEVICES(channelId))

    return totalRows(this.req).getWithData(dataReq)
  }

  deleteDevices(appId, channelId, devicesIds) {
    return this.req.delete(`${urls.messagingChannel(appId, channelId)}/devices`, devicesIds)
      .cacheTags(CHANNEL_DEVICES(channelId))
  }

  loadMessages(appId, channelId, params) {
    const dataReq = this.req.get(`${urls.messagingChannel(appId, channelId)}/messages`).query(params)

    //disable caching for count request
    return totalRows(this.req).getWithData(dataReq, 0)
  }

  publishMessage(appId, channelName, params) {
    return this.req.post(`${urls.messaging(appId)}/${channelName}`, params)
  }

  getMessagingChannels(appId) {
    return this.req.get(`${urls.messaging(appId)}/channels`)
  }

  getPushTemplates(appId) {
    return this.req.get(urls.messagingPushTemplates(appId))
  }

  createPushTemplate(appId, pushTemplate) {
    return this.req.post(urls.messagingPushTemplates(appId), pushTemplate)
  }

  updatePushTemplate(appId, pushTemplateName, pushTemplate) {
    return this.req.put(urls.messagingPushTemplate(appId, pushTemplateName), pushTemplate)
  }

  getPushTemplate(appId, pushTemplateName) {
    return this.req.get(urls.messagingPushTemplate(appId, pushTemplateName))
  }

  deletePushTemplates(appId, pushTemplateNames) {
    return this.req.delete(urls.messagingPushTemplates(appId)).query({ names: pushTemplateNames.join(',') })
  }

  getPushRecipientsCount(appId, where) {
    return this.req.get(urls.messagingPushRecipientsCount(appId)).query({ where })
  }

  sendPush(appId, push) {
    return this.req.post(urls.messagingPush(appId), push)
  }

  getPushButtonTemplates(appId, platform) {
    return this.req.get(urls.messagingPushButtonTemplates(appId)).query({ platform })
  }

  createPushButtonTemplate(appId, templateData) {
    return this.req.post(urls.messagingPushButtonTemplates(appId), templateData)
  }

  updatePushButtonTemplate(appId, templateName, templateData) {
    return this.req.put(urls.messagingPushButtonTemplate(appId, templateName), templateData)
  }

  deletePushButtonTemplate(appId, templateName, platform) {
    return this.req.delete(urls.messagingPushButtonTemplate(appId, templateName)).query({ platform })
  }

  getPushChannelTemplates(appId, platform) {
    return this.req.get(urls.messagingPushChannelTemplates(appId)).query({ platform })
  }

  createPushChannelTemplate(appId, templateData, platform) {
    return this.req.post(urls.messagingPushChannelTemplates(appId), templateData).query({ platform })
  }

  updatePushChannelTemplate(appId, templateName, templateData, platform) {
    return this.req.put(urls.messagingPushChannelTemplate(appId, templateName), templateData).query({ platform })
  }

  deletePushChannelTemplate(appId, templateName, platform) {
    return this.req.delete(urls.messagingPushChannelTemplate(appId, templateName)).query({ platform })
  }
}

export default req => Messaging.create(req)
