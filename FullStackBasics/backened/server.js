import express from 'express';

const app = express();

app.get('/', (req ,res ) => {
    res.send('server is ready')
})
// get a list of 5 jokes 

const githubData = {
  "login": "486220whitedevil",
  "id": 143191874,
  "node_id": "U_kgDOCIjvQg",
  "avatar_url": "https://avatars.githubusercontent.com/u/143191874?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/486220whitedevil",
  "html_url": "https://github.com/486220whitedevil",
  "followers_url": "https://api.github.com/users/486220whitedevil/followers",
  "following_url": "https://api.github.com/users/486220whitedevil/following{/other_user}",
  "gists_url": "https://api.github.com/users/486220whitedevil/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/486220whitedevil/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/486220whitedevil/subscriptions",
  "organizations_url": "https://api.github.com/users/486220whitedevil/orgs",
  "repos_url": "https://api.github.com/users/486220whitedevil/repos",
  "events_url": "https://api.github.com/users/486220whitedevil/events{/privacy}",
  "received_events_url": "https://api.github.com/users/486220whitedevil/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "Deepak Kewat",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": "Computer Science Engineer\r\nJava Full Stack Developer\r\nTechnology - Bootstrap | MongoDB",
  "twitter_username": null,
  "public_repos": 7,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2023-08-25T12:51:59Z",
  "updated_at": "2025-06-10T16:46:57Z"
}
 

app.get('/github' , (req , res) => {
    res.send(githubData);
})

const port = process.env.PORT || 3000;

app.listen(port , () => {
    console.log(`listing at port ${port}`)
})
