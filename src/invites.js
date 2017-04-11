// import urls from './urls'

// TODO: remove this and uncomment next lines when server-side will be ready to provide routes for invites
const data = [{
  email : 'foo@bar.com',
  status: 'Registered',
  credit: ''
}, {
  email : 'bar@baz.com',
  status: 'Not Registered',
  credit: ''
}, {
  email : 'bar@foo.com',
  status: 'Upgraded',
  credit: '$10.00 (issued on 02/10/2017)'
}]

const code = 'ABCDEF123456'

export default (/*req*/) => ({
  getInvitesStatus(/*appId*/) {
    return Promise.resolve(data) //req.get(`${urls.appConsole(appId)}/invites-status`)
  },

  getInviteCode(/*appId*/) {
    return Promise.resolve(code) // req.get(`${urls.appConsole(appId)}/invite-code`)
  },

  sendInvite(/*appId, data*/) {
    return Promise.resolve() // req.post(`${urls.appConsole(appId)}/send-invite`, data)
  }
})
