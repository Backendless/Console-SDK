describe('apiClient.referrals', () => {
  let apiClient
  let referralsAPI

  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    referralsAPI = apiClient.referrals
  })

  describe('loadInviteCode', () => {
    it('should make GET request to load invite code', async () => {
      const inviteCodeResult = {
        code: 'INVITE123ABC',
        url: 'https://backendless.com/invite/INVITE123ABC',
        expiresAt: '2024-12-31T23:59:59Z',
        usageCount: 15,
        maxUsages: 100,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
      mockSuccessAPIRequest(inviteCodeResult)

      const result = await referralsAPI.loadInviteCode()

      expect(result).toEqual(inviteCodeResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/referrals/invite-code',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle detailed invite code information', async () => {
      const inviteCodeResult = {
        code: 'DEV456XYZ',
        url: 'https://backendless.com/invite/DEV456XYZ',
        metadata: {
          type: 'developer',
          tier: 'premium',
          benefits: [
            'Extended free tier',
            'Priority support',
            'Exclusive templates'
          ]
        },
        statistics: {
          totalInvites: 25,
          acceptedInvites: 18,
          conversionRate: 72,
          recentActivity: [
            {
              date: '2024-01-15',
              invites: 3,
              accepted: 2
            },
            {
              date: '2024-01-14',
              invites: 1,
              accepted: 1
            }
          ]
        },
        settings: {
          autoExpire: false,
          notifyOnUse: true,
          trackAnalytics: true
        },
        rewards: {
          perInvite: 10,
          bonus: {
            threshold: 10,
            amount: 50
          },
          totalEarned: 230
        },
        expiresAt: null,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-15T14:30:00Z'
      }
      mockSuccessAPIRequest(inviteCodeResult)

      const result = await referralsAPI.loadInviteCode()

      expect(result).toEqual(inviteCodeResult)
    })

    it('should handle new user without invite code', async () => {
      const inviteCodeResult = {
        code: null,
        message: 'No invite code generated yet',
        canGenerate: true,
        eligibility: {
          requirements: [
            'Account verified',
            'At least one app created',
            'Profile completed'
          ],
          metRequirements: 2,
          totalRequirements: 3
        }
      }
      mockSuccessAPIRequest(inviteCodeResult)

      const result = await referralsAPI.loadInviteCode()

      expect(result).toEqual(inviteCodeResult)
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized access to invite code', 401)

      const error = await referralsAPI.loadInviteCode().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized access to invite code' },
        message: 'Unauthorized access to invite code',
        status: 401
      })
    })

    it('fails when server responds with feature not available error', async () => {
      mockFailedAPIRequest('Referral program not available for your account type', 403)

      const error = await referralsAPI.loadInviteCode().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Referral program not available for your account type' },
        message: 'Referral program not available for your account type',
        status: 403
      })
    })
  })

  describe('loadInvites', () => {
    it('should make GET request to load invites', async () => {
      const invitesResult = {
        invites: [
          {
            id: 'invite-123',
            email: 'john.doe@example.com',
            status: 'accepted',
            sentAt: '2024-01-10T10:00:00Z',
            acceptedAt: '2024-01-11T14:30:00Z',
            rewardEarned: 10
          },
          {
            id: 'invite-456',
            email: 'jane.smith@example.com',
            status: 'pending',
            sentAt: '2024-01-12T09:15:00Z',
            acceptedAt: null,
            rewardEarned: 0
          },
          {
            id: 'invite-789',
            email: 'bob.wilson@example.com',
            status: 'expired',
            sentAt: '2024-01-01T08:00:00Z',
            expiredAt: '2024-01-08T08:00:00Z',
            rewardEarned: 0
          }
        ],
        summary: {
          totalInvites: 3,
          pendingInvites: 1,
          acceptedInvites: 1,
          expiredInvites: 1,
          totalRewards: 10
        },
        pagination: {
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      }
      mockSuccessAPIRequest(invitesResult)

      const result = await referralsAPI.loadInvites()

      expect(result).toEqual(invitesResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/referrals/invites',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty invites list', async () => {
      const invitesResult = {
        invites: [],
        summary: {
          totalInvites: 0,
          pendingInvites: 0,
          acceptedInvites: 0,
          expiredInvites: 0,
          totalRewards: 0
        },
        message: 'No invites sent yet'
      }
      mockSuccessAPIRequest(invitesResult)

      const result = await referralsAPI.loadInvites()

      expect(result).toEqual(invitesResult)
    })

    it('should handle comprehensive invites with detailed tracking', async () => {
      const invitesResult = {
        invites: [
          {
            id: 'invite-premium-101',
            email: 'developer@startup.com',
            status: 'accepted',
            type: 'premium-referral',
            sentAt: '2024-01-05T12:00:00Z',
            acceptedAt: '2024-01-06T09:30:00Z',
            inviteeInfo: {
              name: 'Alex Developer',
              accountCreated: true,
              firstAppCreated: true,
              subscriptionUpgraded: true,
              currentPlan: 'Pro'
            },
            rewards: {
              initial: 10,
              bonus: 25,
              total: 35
            },
            milestones: [
              { name: 'Account Created', completedAt: '2024-01-06T09:30:00Z', reward: 10 },
              { name: 'First App Created', completedAt: '2024-01-06T11:15:00Z', reward: 0 },
              { name: 'Subscription Upgraded', completedAt: '2024-01-07T16:20:00Z', reward: 25 }
            ],
            analytics: {
              clicksOnInviteLink: 3,
              timeToSignup: '21 hours',
              timeToFirstApp: '22.5 hours',
              engagementScore: 85
            }
          }
        ],
        analytics: {
          conversionRate: 68,
          averageTimeToAccept: '18 hours',
          topPerformingChannels: ['email', 'social'],
          seasonalTrends: {
            bestMonths: ['January', 'September'],
            averageInvitesPerMonth: 12
          }
        },
        goals: {
          monthlyTarget: 20,
          currentMonth: 8,
          progress: 40,
          projectedEndOfMonth: 15
        }
      }
      mockSuccessAPIRequest(invitesResult)

      const result = await referralsAPI.loadInvites()

      expect(result).toEqual(invitesResult)
    })

    it('fails when server responds with rate limit error', async () => {
      mockFailedAPIRequest('Too many requests to load invites', 429)

      const error = await referralsAPI.loadInvites().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Too many requests to load invites' },
        message: 'Too many requests to load invites',
        status: 429
      })
    })
  })

  describe('sendInvite', () => {
    it('should make POST request to send invite', async () => {
      const sendResult = {
        inviteId: 'invite-new-123',
        email: 'newuser@example.com',
        status: 'sent',
        inviteUrl: 'https://backendless.com/invite/INVITE123ABC?ref=invite-new-123',
        expiresAt: '2024-01-22T12:00:00Z',
        sentAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(sendResult)

      const inviteData = {
        email: 'newuser@example.com',
        message: 'Join me on Backendless! It\'s an amazing backend platform.',
        personalNote: 'I think you\'ll love building apps with this platform.'
      }

      const result = await referralsAPI.sendInvite(inviteData)

      expect(result).toEqual(sendResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/referrals/invites',
        body: JSON.stringify(inviteData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle bulk invite sending', async () => {
      const sendResult = {
        invites: [
          {
            inviteId: 'invite-bulk-1',
            email: 'user1@example.com',
            status: 'sent'
          },
          {
            inviteId: 'invite-bulk-2',
            email: 'user2@example.com',
            status: 'sent'
          },
          {
            inviteId: 'invite-bulk-3',
            email: 'invalid-email',
            status: 'failed',
            error: 'Invalid email format'
          }
        ],
        summary: {
          totalInvites: 3,
          successful: 2,
          failed: 1
        },
        batchId: 'batch-456'
      }
      mockSuccessAPIRequest(sendResult)

      const inviteData = {
        emails: [
          'user1@example.com',
          'user2@example.com',
          'invalid-email'
        ],
        template: 'developer-invitation',
        customMessage: 'Come join our development team on Backendless!',
        includeBonusOffer: true
      }

      const result = await referralsAPI.sendInvite(inviteData)

      expect(result).toEqual(sendResult)
    })

    it('should handle invite with custom template and tracking', async () => {
      const sendResult = {
        inviteId: 'invite-custom-789',
        email: 'designer@agency.com',
        status: 'sent',
        tracking: {
          trackingId: 'track-789',
          analyticsEnabled: true,
          customParams: {
            source: 'conference',
            campaign: 'design-week-2024'
          }
        }
      }
      mockSuccessAPIRequest(sendResult)

      const inviteData = {
        email: 'designer@agency.com',
        template: {
          subject: 'Exclusive Invitation to Backendless',
          content: 'Custom HTML email template...',
          variables: {
            userName: 'Creative Designer',
            eventName: 'Design Week 2024'
          }
        },
        tracking: {
          source: 'conference',
          campaign: 'design-week-2024',
          medium: 'email'
        },
        settings: {
          sendTime: 'optimal',
          timezone: 'America/New_York',
          followUpAfterDays: 7
        }
      }

      const result = await referralsAPI.sendInvite(inviteData)

      expect(result).toEqual(sendResult)
    })

    it('should handle minimal invite data', async () => {
      const sendResult = {
        inviteId: 'invite-simple-101',
        email: 'simple@example.com',
        status: 'sent'
      }
      mockSuccessAPIRequest(sendResult)

      const inviteData = {
        email: 'simple@example.com'
      }

      const result = await referralsAPI.sendInvite(inviteData)

      expect(result).toEqual(sendResult)
    })

    it('fails when server responds with invalid email error', async () => {
      mockFailedAPIRequest('Invalid email address provided', 400)

      const inviteData = { email: 'invalid-email-format' }
      const error = await referralsAPI.sendInvite(inviteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid email address provided' },
        message: 'Invalid email address provided',
        status: 400
      })
    })

    it('fails when server responds with invite limit reached error', async () => {
      mockFailedAPIRequest('Monthly invite limit reached', 429)

      const inviteData = { email: 'newuser@example.com' }
      const error = await referralsAPI.sendInvite(inviteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Monthly invite limit reached' },
        message: 'Monthly invite limit reached',
        status: 429
      })
    })

    it('fails when server responds with user already invited error', async () => {
      mockFailedAPIRequest('User has already been invited', 409)

      const inviteData = { email: 'existing@example.com' }
      const error = await referralsAPI.sendInvite(inviteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'User has already been invited' },
        message: 'User has already been invited',
        status: 409
      })
    })
  })

  describe('checkInviteId', () => {
    it('should make POST request to check invite ID', async () => {
      const checkResult = {
        valid: true,
        invite: {
          id: 'invite-check-123',
          inviterName: 'John Doe',
          inviterEmail: 'john.doe@example.com',
          sentAt: '2024-01-10T10:00:00Z',
          expiresAt: '2024-01-17T10:00:00Z',
          benefits: [
            'Extended free tier',
            'Premium templates',
            'Priority support'
          ]
        },
        eligibility: {
          canAccept: true,
          requirements: {
            validEmail: true,
            notExistingUser: true,
            notPreviouslyInvited: true
          }
        }
      }
      mockSuccessAPIRequest(checkResult)

      const id = 'invite-check-123'
      const result = await referralsAPI.checkInviteId(id)

      expect(result).toEqual(checkResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/referrals/invite-id',
        body: id,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle invalid invite ID', async () => {
      const checkResult = {
        valid: false,
        reason: 'expired',
        message: 'This invite has expired',
        expiredAt: '2024-01-08T10:00:00Z',
        alternativeOptions: [
          'Request a new invite',
          'Sign up directly'
        ]
      }
      mockSuccessAPIRequest(checkResult)

      const id = 'expired-invite-456'
      const result = await referralsAPI.checkInviteId(id)

      expect(result).toEqual(checkResult)
    })

    it('should handle invite ID with restrictions', async () => {
      const checkResult = {
        valid: true,
        invite: {
          id: 'restricted-invite-789',
          type: 'beta-program',
          restrictions: {
            emailDomainRequired: '@company.com',
            geolocationRequired: ['US', 'CA'],
            accountTypeRequired: 'business'
          }
        },
        eligibility: {
          canAccept: false,
          restrictions: [
            'Email must be from @company.com domain',
            'Account location must be US or Canada'
          ]
        }
      }
      mockSuccessAPIRequest(checkResult)

      const id = 'restricted-invite-789'
      const result = await referralsAPI.checkInviteId(id)

      expect(result).toEqual(checkResult)
    })

    it('should handle invite with usage tracking', async () => {
      const checkResult = {
        valid: true,
        invite: {
          id: 'tracked-invite-101',
          usage: {
            clickCount: 5,
            firstClicked: '2024-01-12T14:30:00Z',
            lastClicked: '2024-01-15T09:15:00Z',
            uniqueVisitors: 3
          },
          analytics: {
            referralSource: 'email',
            userAgent: 'Mozilla/5.0...',
            ipAddress: '192.168.1.100',
            geolocation: {
              country: 'US',
              city: 'New York'
            }
          }
        }
      }
      mockSuccessAPIRequest(checkResult)

      const id = 'tracked-invite-101'
      const result = await referralsAPI.checkInviteId(id)

      expect(result).toEqual(checkResult)
    })

    it('fails when server responds with malformed invite ID error', async () => {
      mockFailedAPIRequest('Malformed invite ID format', 400)

      const id = 'invalid-format-id'
      const error = await referralsAPI.checkInviteId(id).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Malformed invite ID format' },
        message: 'Malformed invite ID format',
        status: 400
      })
    })

    it('fails when server responds with invite not found error', async () => {
      mockFailedAPIRequest('Invite not found', 404)

      const id = 'nonexistent-invite'
      const error = await referralsAPI.checkInviteId(id).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invite not found' },
        message: 'Invite not found',
        status: 404
      })
    })
  })

  describe('confirmUserRegistered', () => {
    it('should make POST request to confirm user registered', async () => {
      const confirmResult = {
        success: true,
        inviteId: 'invite-123',
        reward: {
          amount: 10,
          currency: 'USD',
          type: 'account_credit'
        },
        milestone: 'user_registered',
        nextMilestone: {
          name: 'first_app_created',
          reward: 15,
          description: 'Create your first application to earn additional rewards'
        },
        confirmedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(confirmResult)

      const inviteData = {
        inviteId: 'invite-123',
        userId: 'user-456',
        registrationData: {
          email: 'newuser@example.com',
          signupMethod: 'email',
          referralSource: 'friend'
        }
      }

      const result = await referralsAPI.confirmUserRegistered(inviteData)

      expect(result).toEqual(confirmResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/referrals/events/confirm-user-registered',
        body: JSON.stringify(inviteData),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle confirmation with bonus rewards', async () => {
      const confirmResult = {
        success: true,
        inviteId: 'premium-invite-789',
        rewards: [
          {
            type: 'account_credit',
            amount: 10,
            reason: 'user_registered'
          },
          {
            type: 'account_credit',
            amount: 25,
            reason: 'premium_referral_bonus'
          }
        ],
        totalReward: 35,
        achievements: [
          {
            name: 'First Successful Referral',
            description: 'Successfully referred your first user',
            badgeUrl: 'https://badges.backendless.com/first-referral.png'
          }
        ]
      }
      mockSuccessAPIRequest(confirmResult)

      const inviteData = {
        inviteId: 'premium-invite-789',
        userId: 'premium-user-101',
        registrationData: {
          email: 'premium@startup.com',
          accountType: 'business',
          referralTier: 'premium'
        }
      }

      const result = await referralsAPI.confirmUserRegistered(inviteData)

      expect(result).toEqual(confirmResult)
    })

    it('should handle confirmation with analytics tracking', async () => {
      const confirmResult = {
        success: true,
        inviteId: 'tracked-invite-456',
        tracking: {
          conversionTime: '2 days, 4 hours',
          touchpoints: [
            { timestamp: '2024-01-10T10:00:00Z', action: 'invite_sent' },
            { timestamp: '2024-01-11T14:30:00Z', action: 'invite_clicked' },
            { timestamp: '2024-01-12T09:15:00Z', action: 'signup_started' },
            { timestamp: '2024-01-12T09:30:00Z', action: 'signup_completed' }
          ],
          attribution: {
            source: 'email',
            medium: 'referral',
            campaign: 'friend_invite'
          }
        }
      }
      mockSuccessAPIRequest(confirmResult)

      const inviteData = {
        inviteId: 'tracked-invite-456',
        userId: 'tracked-user-789',
        analytics: {
          signupFlow: 'standard',
          completionTime: 900,
          abandonedSteps: []
        }
      }

      const result = await referralsAPI.confirmUserRegistered(inviteData)

      expect(result).toEqual(confirmResult)
    })

    it('fails when server responds with invite not found error', async () => {
      mockFailedAPIRequest('Invite not found for confirmation', 404)

      const inviteData = { inviteId: 'nonexistent-invite', userId: 'user-123' }
      const error = await referralsAPI.confirmUserRegistered(inviteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invite not found for confirmation' },
        message: 'Invite not found for confirmation',
        status: 404
      })
    })

    it('fails when server responds with already confirmed error', async () => {
      mockFailedAPIRequest('User registration already confirmed for this invite', 409)

      const inviteData = { inviteId: 'confirmed-invite', userId: 'existing-user' }
      const error = await referralsAPI.confirmUserRegistered(inviteData).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'User registration already confirmed for this invite' },
        message: 'User registration already confirmed for this invite',
        status: 409
      })
    })
  })

  describe('confirmFirstAppCreated', () => {
    it('should make POST request to confirm first app created', async () => {
      const confirmResult = {
        success: true,
        milestone: 'first_app_created',
        reward: {
          amount: 15,
          currency: 'USD',
          type: 'account_credit'
        },
        bonusRewards: [
          {
            type: 'template_access',
            description: 'Unlocked premium app templates',
            templates: ['e-commerce-pro', 'social-media-starter']
          }
        ],
        nextMilestone: {
          name: 'first_deployment',
          reward: 20,
          description: 'Deploy your first app to production'
        },
        confirmedAt: '2024-01-15T12:00:00Z'
      }
      mockSuccessAPIRequest(confirmResult)

      const result = await referralsAPI.confirmFirstAppCreated()

      expect(result).toEqual(confirmResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/referrals/events/confirm-first-app-created',
        body: undefined,
        method: 'POST',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle confirmation with progressive rewards', async () => {
      const confirmResult = {
        success: true,
        milestone: 'first_app_created',
        progressiveRewards: {
          currentLevel: 2,
          levelName: 'App Creator',
          rewards: [
            { level: 1, reward: 10, description: 'Account created' },
            { level: 2, reward: 15, description: 'First app created' },
            { level: 3, reward: 20, description: 'First deployment', locked: true }
          ],
          totalEarned: 25,
          nextLevelRequirement: 'Deploy your first application'
        },
        achievements: [
          {
            id: 'first-app-badge',
            name: 'App Creator',
            description: 'Created your first Backendless application'
          }
        ]
      }
      mockSuccessAPIRequest(confirmResult)

      const result = await referralsAPI.confirmFirstAppCreated()

      expect(result).toEqual(confirmResult)
    })

    it('should handle confirmation with referrer rewards', async () => {
      const confirmResult = {
        success: true,
        userReward: {
          amount: 15,
          type: 'account_credit'
        },
        referrerReward: {
          amount: 5,
          type: 'referral_bonus',
          description: 'Your referral created their first app!'
        },
        milestoneChain: {
          completed: ['user_registered', 'first_app_created'],
          remaining: ['first_deployment', 'first_payment'],
          totalPotentialReward: 75
        }
      }
      mockSuccessAPIRequest(confirmResult)

      const result = await referralsAPI.confirmFirstAppCreated()

      expect(result).toEqual(confirmResult)
    })

    it('fails when server responds with milestone already achieved error', async () => {
      mockFailedAPIRequest('First app creation milestone already confirmed', 409)

      const error = await referralsAPI.confirmFirstAppCreated().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'First app creation milestone already confirmed' },
        message: 'First app creation milestone already confirmed',
        status: 409
      })
    })

    it('fails when server responds with prerequisite not met error', async () => {
      mockFailedAPIRequest('User registration milestone must be completed first', 422)

      const error = await referralsAPI.confirmFirstAppCreated().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'User registration milestone must be completed first' },
        message: 'User registration milestone must be completed first',
        status: 422
      })
    })

    it('fails when server responds with no referral context error', async () => {
      mockFailedAPIRequest('No active referral context found for milestone confirmation', 404)

      const error = await referralsAPI.confirmFirstAppCreated().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'No active referral context found for milestone confirmation' },
        message: 'No active referral context found for milestone confirmation',
        status: 404
      })
    })
  })
})
