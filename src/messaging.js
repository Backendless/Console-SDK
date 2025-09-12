/* eslint-disable max-len */

import urls from './urls'
import totalRows from './utils/total-rows'
import { CHANNEL_DEVICES } from './utils/cache-tags'
import BaseService from './base/BaseService'

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

  /**
   * @aiToolName Load Channels
   * @category Messaging
   * @description Load all messaging channels for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"channelid":"test-channel","name":"test-channel","settings":{"polling":true,"rtmp":0,"websocket":8888}}]
   */
  loadChannels(appId) {
    return this.req.get(urls.messagingChannels(appId))
  }

  /**
   * @aiToolName Create Channel
   * @category Messaging
   * @description Create a new messaging channel
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"channelName","label":"Channel Name","description":"The name of the channel to create","required":true}
   * @sampleResult {"channelid":"new-channel","name":"new-channel","settings":{"polling":true,"rtmp":0,"websocket":8888}}
   */
  createChannel(appId, channelName) {
    const channel = enrichChannelWithSettings({ name: channelName })

    return this.req.post(urls.messagingChannels(appId), channel)
  }

  /**
   * @typedef {Object} renameChannel__oldChannel
   * @paramDef {"type":"string","label":"Channel ID","name":"channelid","required":true,"description":"The unique identifier of the channel"}
   * @paramDef {"type":"string","label":"Channel Name","name":"name","required":true,"description":"The current name of the channel"}
   */

  /**
   * @aiToolName Rename Channel
   * @category Messaging
   * @description Rename an existing messaging channel. Settings are automatically maintained.
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"renameChannel__oldChannel","name":"oldChannel","label":"Channel Object","description":"Object containing channelid and current name","required":true}
   * @paramDef {"type":"string","name":"newName","label":"New Name","description":"The new name for the channel","required":true}
   * @sampleResult {"channelid":"90B294D5-0C04-47DC-8893-D131845311FA","name":"new-channel-name","settings":{"polling":true,"rtmp":0,"websocket":8888}}
   */
  renameChannel(appId, oldChannel, newName) {
    const channel = enrichChannelWithSettings(oldChannel)
    channel.name = newName

    return this.req.put(urls.messagingChannel(appId, channel.channelid), channel)
  }

  /**
   * @aiToolName Delete Channel
   * @category Messaging
   * @description Delete a messaging channel
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"channelId","label":"Channel ID","description":"The identifier of the channel to delete","required":true}
   * @sampleResult true
   */
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

  /**
   * @aiToolName Delete Devices
   * @category Messaging
   * @description Delete devices from a messaging channel
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"channelId","label":"Channel ID","description":"The identifier of the channel","required":true}
   * @paramDef {"type":"array","name":"devicesIds","label":"Device IDs","description":"Array of device IDs to delete","required":true}
   * @sampleResult true
   */
  deleteDevices(appId, channelId, devicesIds) {
    return this.req.delete(`${urls.messagingChannel(appId, channelId)}/devices`, devicesIds)
      .cacheTags(CHANNEL_DEVICES(channelId))
  }

  /**
   * @aiToolName Load Messages
   * @category Messaging
   * @description Load messages from a messaging channel
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"channelId","label":"Channel ID","description":"The identifier of the channel","required":true}
   * @paramDef {"type":"object","name":"params","label":"Query Parameters","description":"Query parameters for filtering messages","required":false}
   * @sampleResult {"totalRows": 1,"data": [{"publisherId": "samplePublisherId","isPush": true,"sentTo": "sampleUserId","isBroadcast": false,"messageId": "message:SAMPLE-ID-123456","message": "sample message","subtopic": "sampleSubtopic","timestamp": 1757603031106}]}
   */
  loadMessages(appId, channelId, params) {
    const dataReq = this.req.get(`${urls.messagingChannel(appId, channelId)}/messages`).query(params)

    //disable caching for count request
    return totalRows(this.req).getWithData(dataReq, 0)
  }

  /**
   * @typedef {Object} publishMessage__headers
   * @paramDef {"type":"string","label":"Header Value","name":"[key]","required":false,"description":"Custom header key-value pairs"}
   */

  /**
   * @typedef {Object} publishMessage__params
   * @paramDef {"type":"string","label":"Message","name":"message","required":true,"description":"The message content to publish"}
   * @paramDef {"type":"string","label":"Publisher ID","name":"publisherId","required":false,"description":"Optional identifier of the message publisher"}
   * @paramDef {"type":"string","label":"Push Broadcast","name":"pushBroadcast","required":true,"description":"Target platform for push notifications: IOS, ANDROID, or ALL"}
   * @paramDef {"type":"publishMessage__headers","label":"Headers","name":"headers","required":false,"description":"Optional custom headers for the message"}
   */

  /**
   * @aiToolName Publish Message
   * @category Messaging
   * @description Publish a message to a messaging channel with optional push notification broadcast
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"channelName","label":"Channel Name","description":"The name of the channel","required":true}
   * @paramDef {"type":"publishMessage__params","name":"params","label":"Message Parameters","description":"Message content with push broadcast settings and optional headers","required":true}
   * @sampleResult {"errorMessage":null,"messageId":"message:6ED94D19-172B-48AE-BB2C-7AA8E305CD31","status":"scheduled"}
   */
  publishMessage(appId, channelName, params) {
    return this.req.post(`${urls.messaging(appId)}/${channelName}`, params)
  }

  /**
   * @aiToolName Get Messaging Channels
   * @category Messaging
   * @description Get all messaging channels for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"channelid":"channel1","name":"channel1","settings":{"polling":true,"rtmp":0,"websocket":8888}}]
   */
  getMessagingChannels(appId) {
    return this.req.get(`${urls.messaging(appId)}/channels`)
  }

  /**
   * @aiToolName Get Push Templates
   * @category Messaging
   * @description Get all push notification templates for an application
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"id":"68c2e72c3f5cad82dae4d86a","name":"welcome","message":"Welcome to our app!","platforms":[],"channelName":"default","segmentQuery":null,"options":{"ios":{"alertTitle":null,"alertSubtitle":null,"customHeaders":null,"badge":1,"sound":null,"attachmentUrl":null,"mutableContent":0,"contentAvailable":0,"buttonTemplate":"","threadId":null,"summaryFormat":null},"android":{"contentTitle":null,"summarySubText":null,"customHeaders":null,"badge":0,"badgeNumber":1,"icon":null,"largeIcon":null,"colorCode":"#3E86C4","cancel":{"after":60,"ontap":false},"attachmentUrl":null,"actionOnTap":null,"contentAvailable":null,"buttonTemplate":"","channelTemplate":"","directBoot":false,"deliveryPriority":"normal","ttlSeconds":2419200},"osx":{"alertTitle":null,"alertSubtitle":null,"customHeaders":null,"badge":1,"sound":"default","contentAvailable":0}}}]
   */
  getPushTemplates(appId) {
    return this.req.get(urls.messagingPushTemplates(appId))
  }

  createPushTemplate(appId, pushTemplate) {
    return this.req.post(urls.messagingPushTemplates(appId), pushTemplate)
  }

  updatePushTemplate(appId, pushTemplateName, pushTemplate) {
    return this.req.put(urls.messagingPushTemplate(appId, pushTemplateName), pushTemplate)
  }

  /**
   * @aiToolName Get Push Template
   * @category Messaging
   * @description Get a specific push notification template
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"string","name":"pushTemplateName","label":"Template Name","description":"The name of the template to retrieve","required":true}
   * @sampleResult {"id":"68c2e72c3f5cad82dae4d86a","name":"ooo","message":"jj","platforms":[],"channelName":"default","segmentQuery":null,"options":{"ios":{"alertTitle":null,"alertSubtitle":null,"customHeaders":null,"badge":1,"sound":null,"attachmentUrl":null,"mutableContent":0,"contentAvailable":0,"buttonTemplate":"","threadId":null,"summaryFormat":null},"android":{"contentTitle":null,"summarySubText":null,"customHeaders":null,"badge":0,"badgeNumber":1,"icon":null,"largeIcon":null,"colorCode":"#3E86C4","cancel":{"after":60,"ontap":false},"attachmentUrl":null,"actionOnTap":null,"contentAvailable":null,"buttonTemplate":"","channelTemplate":"","directBoot":false,"deliveryPriority":"normal","ttlSeconds":2419200},"osx":{"alertTitle":null,"alertSubtitle":null,"customHeaders":null,"badge":1,"sound":"default","contentAvailable":0}}}
   */
  getPushTemplate(appId, pushTemplateName) {
    return this.req.get(urls.messagingPushTemplate(appId, pushTemplateName))
  }

  /**
   * @aiToolName Delete Push Templates
   * @category Messaging
   * @description Delete multiple push notification templates
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"array","name":"pushTemplateNames","label":"Template Names","description":"Array of template names to delete","required":true}
   * @sampleResult true
   */
  deletePushTemplates(appId, pushTemplateNames) {
    return this.req.delete(urls.messagingPushTemplates(appId)).query({ names: pushTemplateNames.join(',') })
  }

  getPushRecipientsCount(appId, where) {
    return this.req.get(urls.messagingPushRecipientsCount(appId)).query({ where })
  }

  /**
   * @typedef {Object} sendPush__androidCancel
   * @paramDef {"type":"number","label":"After","name":"after","required":false,"description":"Cancel notification after specified seconds"}
   * @paramDef {"type":"boolean","label":"On Tap","name":"ontap","required":false,"description":"Cancel notification when tapped"}
   */

  /**
   * @typedef {Object} sendPush__androidOptions
   * @paramDef {"type":"sendPush__androidCancel","label":"Cancel Settings","name":"cancel","required":false,"description":"Auto-cancel notification settings"}
   * @paramDef {"type":"string","label":"Color Code","name":"colorCode","required":false,"description":"Notification color in hex format"}
   * @paramDef {"type":"number","label":"TTL Seconds","name":"ttlSeconds","required":false,"description":"Time to live in seconds"}
   * @paramDef {"type":"string","label":"Delivery Priority","name":"deliveryPriority","required":false,"description":"Delivery priority: normal or high"}
   * @paramDef {"type":"number","label":"Badge","name":"badge","required":false,"description":"Badge number for notification"}
   * @paramDef {"type":"number","label":"Badge Number","name":"badgeNumber","required":false,"description":"Badge number to display"}
   * @paramDef {"type":"string","label":"Button Template","name":"buttonTemplate","required":false,"description":"Button template to use"}
   * @paramDef {"type":"string","label":"Channel Template","name":"channelTemplate","required":false,"description":"Channel template to use"}
   * @paramDef {"type":"object","label":"Custom Headers","name":"customHeaders","required":false,"description":"Custom headers for the notification"}
   * @paramDef {"type":"boolean","label":"Direct Boot","name":"directBoot","required":false,"description":"Enable direct boot support"}
   * @paramDef {"type":"string","label":"Content Title","name":"contentTitle","required":false,"description":"Title for the notification"}
   * @paramDef {"type":"string","label":"Summary Sub Text","name":"summarySubText","required":false,"description":"Summary text for notification"}
   * @paramDef {"type":"string","label":"Icon","name":"icon","required":false,"description":"Icon for the notification"}
   * @paramDef {"type":"string","label":"Large Icon","name":"largeIcon","required":false,"description":"Large icon for the notification"}
   * @paramDef {"type":"string","label":"Attachment URL","name":"attachmentUrl","required":false,"description":"URL for notification attachment"}
   * @paramDef {"type":"string","label":"Action On Tap","name":"actionOnTap","required":false,"description":"Action when notification is tapped"}
   * @paramDef {"type":"string","label":"Content Available","name":"contentAvailable","required":false,"description":"Content available flag"}
   * @paramDef {"type":"object","label":"Lights","name":"lights","required":false,"description":"LED light settings"}
   */

  /**
   * @typedef {Object} sendPush__iosOptions
   * @paramDef {"type":"number","label":"Content Available","name":"contentAvailable","required":false,"description":"Content available flag"}
   * @paramDef {"type":"number","label":"Mutable Content","name":"mutableContent","required":false,"description":"Mutable content flag"}
   * @paramDef {"type":"string","label":"Button Template","name":"buttonTemplate","required":false,"description":"Button template to use"}
   * @paramDef {"type":"object","label":"Custom Headers","name":"customHeaders","required":false,"description":"Custom headers for the notification"}
   * @paramDef {"type":"number","label":"Badge","name":"badge","required":false,"description":"Badge number for notification"}
   * @paramDef {"type":"string","label":"Alert Title","name":"alertTitle","required":false,"description":"Alert title for notification"}
   * @paramDef {"type":"string","label":"Alert Subtitle","name":"alertSubtitle","required":false,"description":"Alert subtitle for notification"}
   * @paramDef {"type":"string","label":"Sound","name":"sound","required":false,"description":"Sound file for notification"}
   * @paramDef {"type":"string","label":"Attachment URL","name":"attachmentUrl","required":false,"description":"URL for notification attachment"}
   * @paramDef {"type":"string","label":"Thread ID","name":"threadId","required":false,"description":"Thread identifier for grouping"}
   * @paramDef {"type":"string","label":"Summary Format","name":"summaryFormat","required":false,"description":"Format for summary"}
   */

  /**
   * @typedef {Object} sendPush__osxOptions
   * @paramDef {"type":"number","label":"Content Available","name":"contentAvailable","required":false,"description":"Content available flag"}
   * @paramDef {"type":"object","label":"Custom Headers","name":"customHeaders","required":false,"description":"Custom headers for the notification"}
   * @paramDef {"type":"number","label":"Badge","name":"badge","required":false,"description":"Badge number for notification"}
   * @paramDef {"type":"string","label":"Sound","name":"sound","required":false,"description":"Sound file for notification"}
   * @paramDef {"type":"string","label":"Alert Title","name":"alertTitle","required":false,"description":"Alert title for notification"}
   * @paramDef {"type":"string","label":"Alert Subtitle","name":"alertSubtitle","required":false,"description":"Alert subtitle for notification"}
   */

  /**
   * @typedef {Object} sendPush__options
   * @paramDef {"type":"sendPush__androidOptions","label":"Android Options","name":"android","required":false,"description":"Android-specific push notification options"}
   * @paramDef {"type":"sendPush__iosOptions","label":"iOS Options","name":"ios","required":false,"description":"iOS-specific push notification options"}
   * @paramDef {"type":"sendPush__osxOptions","label":"OSX Options","name":"osx","required":false,"description":"OSX-specific push notification options"}
   */

  /**
   * @typedef {Object} sendPush__push
   * @paramDef {"type":"array","label":"Platforms","name":"platforms","required":false,"description":"Target platforms for push notification (IOS, ANDROID, OSX) arr empty array for all platforms"}
   * @paramDef {"type":"string","label":"Message","name":"message","required":true,"description":"The push notification message"}
   * @paramDef {"type":"sendPush__options","label":"Options","name":"options","required":false,"description":"Platform-specific options for the notification"}
   * @paramDef {"type":"string","label":"Name","name":"name","required":false,"description":"Name identifier for the push notification"}
   * @paramDef {"type":"string","label":"Channel Name","name":"channelName","required":false,"description":"Channel name for the notification"}
   */

  /**
   * @aiToolName Send Push
   * @category Messaging
   * @description Send a push notification with platform-specific options
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @paramDef {"type":"sendPush__push","name":"push","label":"Push Notification","description":"Push notification object with message and platform-specific options","required":true}
   * @sampleResult {"messageId":"message:829739EB-443D-4591-B7E5-BAB07D7BC231","errorMessage":null,"status":"SCHEDULED","sendingTimeInMillis":0,"successfulSendsAmount":1,"failedSendsAmount":0}
   */
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

  /**
   * @aiToolName Get Push Channel Templates
   * @category Messaging
   * @description Get push notification channel templates for a platform
   * @paramDef {"type":"string","name":"appId","label":"Application ID","description":"The identifier of the application","required":true}
   * @sampleResult [{"id":"68c2eb2d3f5cad82dae4d86b","name":"Name","message":"Message","platforms":["IOS","OSX"],"channelName":"default","segmentQuery":null,"options":{"ios":{"alertTitle":"Title","alertSubtitle":"Subtitle","customHeaders":{"Header":"1"},"badge":1,"sound":null,"attachmentUrl":null,"mutableContent":0,"contentAvailable":0,"buttonTemplate":"","threadId":null,"summaryFormat":null},"android":{"contentTitle":"Title","summarySubText":"Subtitle","customHeaders":{"Header":"1"},"badge":1,"badgeNumber":5,"icon":null,"largeIcon":null,"colorCode":"#3E86C4","cancel":{"after":60,"ontap":false},"attachmentUrl":null,"actionOnTap":null,"contentAvailable":null,"buttonTemplate":"","channelTemplate":"","directBoot":false,"deliveryPriority":"normal","ttlSeconds":2419200},"osx":{"alertTitle":"Title","alertSubtitle":"Subtitle","customHeaders":{"Header":"1"},"badge":1,"sound":"default","contentAvailable":0}}}]
   */
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
