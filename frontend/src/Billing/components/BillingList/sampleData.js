const now = new Date()

export default [
  {
    _id: '000000000000000000000001',
    ownerId: '000000000000000000000002',
    ownerType: 'organization',
    userId: '000000000000000000000003',
    trialEnd: '2018-07-12T16:37:57.793Z',
    paymentSourceSet: true,
    paymentSourceLastFour: 5555,
    subscriptions: [
      {
        repoId: '000000000000000000000004',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
      {
        repoId: '000000000000000000000005',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
    ],
  },
  {
    _id: '000000000000000000000015',
    ownerId: '000000000000000000000016',
    ownerType: 'organization',
    userId: '000000000000000000000003',
    trialEnd: new Date().setDate(now.getDate() + 14),
    paymentSourceSet: false,
    subscriptions: [
      {
        repoId: '000000000000000000000018',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
      {
        repoId: '000000000000000000000019',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
    ],
  },
  {
    _id: '000000000000000000000020',
    ownerId: '000000000000000000000021',
    ownerType: 'organization',
    userId: '000000000000000000000003',
    trialEnd: new Date().setDate(now.getDate() + 2),
    paymentSourceSet: false,
    subscriptions: [
      {
        repoId: '000000000000000000000022',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
      {
        repoId: '000000000000000000000023',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
    ],
  },
  {
    _id: '000000000000000000000024',
    ownerId: '000000000000000000000025',
    ownerType: 'organization',
    userId: '000000000000000000000003',
    trialEnd: now,
    paymentSourceSet: false,
    subscriptions: [
      {
        repoId: '000000000000000000000026',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
      {
        repoId: '000000000000000000000027',
        planId: 'plan_notarealplan',
        amount: 2000,
        currency: 'usd',
      },
    ],
  },
]
