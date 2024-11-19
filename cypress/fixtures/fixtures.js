export const fixtures = {
    mockPostData: {
      data: [
        {
          id: 18,
          post: { id: 18 },
          type: 'photo',
          liked: true,
          text: 'Some random text.',
          employee: {
            empNumber: 7,
            lastName: 'Doe',
            firstName: 'John',
            middleName: 'Michael',
            employeeId: 'johnmdoe',
          },
          stats: { numOfLikes: 1, numOfComments: 0, numOfShares: 0 },
          createdDate: '2024-11-17',
          createdTime: '11:05',
        },
      ],
    },
    mockBuzzFeed: {
      data: [
        {
          id: 10,
          post: { id: 10 },
          type: 'photo',
          liked: true,
          text: 'Some random text.',
          employee: {
            empNumber: 7,
            lastName: 'Doe',
            firstName: 'John',
            middleName: 'Michael',
            employeeId: 'johnmdoe',
          },
          stats: { numOfLikes: 2, numOfComments: 3, numOfShares: 4 },
          createdDate: '2024-11-17',
          createdTime: '11:05',
        },
      ],
    },
    mockLike: {
      statusCode: 200,
      body: {
        data: { id: 74, date: '2024-11-17', time: '11:57', share: { id: 10 } },
      },
    },
    mockComment: {
      statusCode: 200,
      body: {
        data: {
          comment: { id: 38, createdDate: '2024-11-17', createdTime: '11:57' },
        },
      },
    },
    mockShare: {
      statusCode: 200,
      body: {
        data: {
          share: { id: 40 },
          post: { id: 9 },
        },
      },
    },
  };