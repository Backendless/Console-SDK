export default {
  'plans': [
    {
      'name': 'BACKENDLESS ONE',
      'isCurrent': true,
      'baseprice': 30,
      'totalprice': 30
    },
    {
      'name': 'BACKENDLESS TWO',
      'isCurrent': false,
      'baseprice': 70,
      'totalprice': 30
    },
    {
      'name': 'BACKENDLESS THREE',
      'isCurrent': false,
      'baseprice': 90,
      'totalprice': 30
    }
  ],
    'functions': [
    {
      'name': 'API Calls/minute',
      'unit': 'calls/minute',
      'usage': 200,
      'limits': [
        {
          'plan': 'Backendless One',
          'limit': 600,
          'functionpack': {
            'price': 100,
            'units': 600
          }
        },
        {
          'plan': 'Backendless Two',
          'limit': 600,
          'functionpack': {
            'price': 80,
            'units': 600
          }
        },
        {
          'plan': 'Backendless Three',
          'limit': 1200,
          'functionpack': {
            'price': 70,
            'units': 1200
          }
        }
      ],
      'purchases': 1
    },
    {
      'name': 'Custom security role',
      'unit': null,
      'usage': -1,
      'limits': [
        {
          'plan': 'Backendless One',
          'limit': 1,
          'functionpack': {
            'price': 20,
            'units': -1
          }
        },
        {
          'plan': 'Backendless Two',
          'limit': 3,
          'functionpack': {
            'price': 20,
            'units': -1
          }
        },
        {
          'plan': 'Backendless Three',
          'limit': 5,
          'functionpack': {
            'price': 20,
            'units': -1
          }
        }
      ],
      'purchases': 0
    },
    {
      'name': 'Data storage',
      'unit': 'GB',
      'usage': 1.2,
      'limits': [
        {
          'plan': 'Backendless One',
          'limit': 1
        },
        {
          'plan': 'Backendless Two',
          'limit': 2
        },
        {
          'plan': 'Backendless Three',
          'limit': 3
        }
      ],
      'purchases': 0
    }
  ]
}
