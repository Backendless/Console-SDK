describe('apiClient.initialQuestionnaire', () => {
  let apiClient
  let initialQuestionnaireAPI

  const successResult = { data: 'success' }

  beforeAll(() => {
    apiClient = createAPIClient('http://test-host:3000')
    initialQuestionnaireAPI = apiClient.initialQuestionnaire
  })

  describe('loadQuestions', () => {
    it('should make GET request to load questions', async () => {
      const questionsResult = {
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            title: 'What is your primary development experience?',
            options: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Other']
          },
          {
            id: 'q2',
            type: 'text',
            title: 'What type of application are you building?',
            placeholder: 'e.g., e-commerce, social media, etc.'
          }
        ]
      }
      mockSuccessAPIRequest(questionsResult)

      const result = await initialQuestionnaireAPI.loadQuestions()

      expect(result).toEqual(questionsResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/initial-questionnaire/questions',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty questions response', async () => {
      const questionsResult = { questions: [] }
      mockSuccessAPIRequest(questionsResult)

      const result = await initialQuestionnaireAPI.loadQuestions()

      expect(result).toEqual(questionsResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/initial-questionnaire/questions',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex questions with validation rules', async () => {
      const questionsResult = {
        questions: [
          {
            id: 'experience',
            type: 'rating',
            title: 'Rate your development experience',
            scale: { min: 1, max: 10 },
            required: true
          },
          {
            id: 'technologies',
            type: 'checkbox',
            title: 'Which technologies are you familiar with?',
            options: [
              { id: 'javascript', label: 'JavaScript' },
              { id: 'python', label: 'Python' },
              { id: 'java', label: 'Java' },
              { id: 'csharp', label: 'C#' }
            ],
            validation: { minSelection: 1, maxSelection: 3 }
          }
        ],
        metadata: {
          version: '1.2',
          locale: 'en-US',
          estimatedTime: '5 minutes'
        }
      }
      mockSuccessAPIRequest(questionsResult)

      const result = await initialQuestionnaireAPI.loadQuestions()

      expect(result).toEqual(questionsResult)
    })

    it('fails when server responds with service unavailable error', async () => {
      mockFailedAPIRequest('Questionnaire service unavailable', 503)

      const error = await initialQuestionnaireAPI.loadQuestions().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Questionnaire service unavailable' },
        message: 'Questionnaire service unavailable',
        status: 503
      })
    })

    it('fails when server responds with unauthorized error', async () => {
      mockFailedAPIRequest('Unauthorized access', 401)

      const error = await initialQuestionnaireAPI.loadQuestions().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Unauthorized access' },
        message: 'Unauthorized access',
        status: 401
      })
    })
  })

  describe('sendAnswers', () => {
    it('should make POST request to send answers', async () => {
      const submitResult = {
        success: true,
        submissionId: 'sub-123',
        message: 'Thank you for completing the questionnaire!'
      }
      mockSuccessAPIRequest(submitResult)

      const answers = {
        q1: 'Full Stack',
        q2: 'Building an e-commerce platform'
      }

      const result = await initialQuestionnaireAPI.sendAnswers(answers)

      expect(result).toEqual(submitResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/initial-questionnaire/answers',
        body: JSON.stringify(answers),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle complex answers with multiple data types', async () => {
      const submitResult = { success: true, submissionId: 'sub-456' }
      mockSuccessAPIRequest(submitResult)

      const answers = {
        experience: 8,
        technologies: ['javascript', 'python'],
        projectType: 'web-application',
        budget: {
          range: '10k-50k',
          currency: 'USD'
        },
        timeline: {
          start: '2024-01-01',
          end: '2024-06-01'
        },
        additionalInfo: 'Looking for scalable backend solutions',
        contactPreferences: {
          email: true,
          phone: false,
          newsletter: true
        }
      }

      const result = await initialQuestionnaireAPI.sendAnswers(answers)

      expect(result).toEqual(submitResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/initial-questionnaire/answers',
        body: JSON.stringify(answers),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle empty answers object', async () => {
      const submitResult = { success: false, errors: ['No answers provided'] }
      mockSuccessAPIRequest(submitResult)

      const answers = {}

      const result = await initialQuestionnaireAPI.sendAnswers(answers)

      expect(result).toEqual(submitResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/initial-questionnaire/answers',
        body: JSON.stringify(answers),
        method: 'POST',
        encoding: 'utf8',
        headers: { 'Content-Type': 'application/json' },
        timeout: 0,
        withCredentials: false
      }])
    })

    it('fails when server responds with validation error', async () => {
      mockFailedAPIRequest('Invalid answer format', 400)

      const answers = { invalidQuestion: 'invalid answer' }
      const error = await initialQuestionnaireAPI.sendAnswers(answers).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Invalid answer format' },
        message: 'Invalid answer format',
        status: 400
      })
    })

    it('fails when server responds with required answers missing error', async () => {
      mockFailedAPIRequest('Required answers missing', 422)

      const answers = { q1: 'Answered', q2: '' } // Missing required answer
      const error = await initialQuestionnaireAPI.sendAnswers(answers).catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Required answers missing' },
        message: 'Required answers missing',
        status: 422
      })
    })
  })

  describe('loadStatus', () => {
    it('should make GET request to load status', async () => {
      const statusResult = {
        completed: true,
        submissionDate: '2024-01-15T10:30:00Z',
        submissionId: 'sub-123'
      }
      mockSuccessAPIRequest(statusResult)

      const result = await initialQuestionnaireAPI.loadStatus()

      expect(result).toEqual(statusResult)
      expect(apiRequestCalls()).toEqual([{
        path: 'http://test-host:3000/console/community/initial-questionnaire/status',
        body: undefined,
        method: 'GET',
        encoding: 'utf8',
        headers: {},
        timeout: 0,
        withCredentials: false
      }])
    })

    it('should handle incomplete status', async () => {
      const statusResult = {
        completed: false,
        progress: {
          totalQuestions: 5,
          answeredQuestions: 2,
          percentage: 40
        },
        lastActivity: '2024-01-14T15:20:00Z'
      }
      mockSuccessAPIRequest(statusResult)

      const result = await initialQuestionnaireAPI.loadStatus()

      expect(result).toEqual(statusResult)
    })

    it('should handle new user status', async () => {
      const statusResult = {
        completed: false,
        firstTime: true,
        availableLanguages: ['en', 'es', 'fr', 'de'],
        estimatedTime: '5-10 minutes'
      }
      mockSuccessAPIRequest(statusResult)

      const result = await initialQuestionnaireAPI.loadStatus()

      expect(result).toEqual(statusResult)
    })

    it('should handle detailed completion status', async () => {
      const statusResult = {
        completed: true,
        submissionDate: '2024-01-15T10:30:00Z',
        submissionId: 'sub-789',
        results: {
          score: 85,
          recommendations: [
            'Consider exploring our React templates',
            'Check out our database optimization guides'
          ],
          nextSteps: [
            'Setup your first application',
            'Configure authentication'
          ]
        },
        followUp: {
          scheduledCall: false,
          emailReminders: true,
          resourcesShared: ['tutorial-links', 'documentation']
        }
      }
      mockSuccessAPIRequest(statusResult)

      const result = await initialQuestionnaireAPI.loadStatus()

      expect(result).toEqual(statusResult)
    })

    it('fails when server responds with not found error', async () => {
      mockFailedAPIRequest('User questionnaire status not found', 404)

      const error = await initialQuestionnaireAPI.loadStatus().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'User questionnaire status not found' },
        message: 'User questionnaire status not found',
        status: 404
      })
    })

    it('fails when server responds with access denied error', async () => {
      mockFailedAPIRequest('Access denied to questionnaire status', 403)

      const error = await initialQuestionnaireAPI.loadStatus().catch(e => e)

      expect(error).toBeInstanceOf(Error)
      expect({ ...error }).toEqual({
        body: { message: 'Access denied to questionnaire status' },
        message: 'Access denied to questionnaire status',
        status: 403
      })
    })
  })
})
