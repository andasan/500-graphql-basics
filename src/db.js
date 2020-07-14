//dummy data
let users = [
    {
        id: '1',
        name: 'Potato',
        email: 'ishiyaki@mail.com',
        age: 25
    },
    {
        id: '2',
        name: 'Avi',
        email: 'shotgun@mail.com',
        age: 23
    }
];

let posts = [
    {
        id: '10',
        title: 'GraphQL Basics',
        body: 'this is basic stuff',
        published: true,
        author: '1'
    },
    {
        id: '11',
        title: 'Advanced GraphQL',
        body: 'this is advanced stuff',
        published: true,
        author: '1'
    },
    {
        id: '12',
        title: 'Master GraphQL',
        body: 'this is way too advanced',
        published: false,
        author: '2'
    }
];

let comments = [
    {
        id: '1',
        text: 'Yummy',
        author: '1',
        post: '10'
    },
    {
        id: '2',
        text: 'Sweet',
        author: '1',
        post: '11'
    }
]

const db = {
    users: users,
    posts,
    comments
};

export { db as default };