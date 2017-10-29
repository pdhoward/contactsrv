'use strict';
/////////////////////////////////////////////////////
////////  		unit test server               ///////
///////         xio labs v 1.2.0            ///////
//////////////////////////////////////////////////


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const contacts = require('./contacts')
const login = require('./login')

const app = express()

app.use(express.static('public'))
app.use(cors())

// help doc
app.get('/', (req, res) => {
  const help = `
  <pre>
    MY APIs

    Use an Authorization header to work with your own data:

    fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})

    The following endpoints are available:

    GET /contacts
    DELETE /contacts/:id
    POST /contacts { name, email, avatarURL }
  </pre>
  `

  res.send(help)
})

// simple auth test
app.use((req, res, next) => {
  const token = req.get('Authorization')

  if (token) {
    req.token = token
    next()
  } else {
    res.status(403).send({
    error: 'Please provide an Authorization header to identify yourself (can be whatever you want)'
    })
  }
})

// api catalogue
app.get('/contacts', (req, res) => {
  res.send(contacts.get(req.token))
})

app.delete('/contacts/:id', (req, res) => {
  res.send(contacts.remove(req.token, req.params.id))
})

app.post('/contacts', bodyParser.json(), (req, res) => {
  const { name, email } = req.body

  if (name && email) {
    res.send(contacts.add(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Please provide both a name and email address'
    })
  }
})

//  login functions
// needs to be refactored for validation, authentication
app.post('/login', bodyParser.json(), (req, res) => {
  const { username, password } = req.body

  if (username && password) {
    login.verify(req.token, username, password).then((result) =>
          console.log("Login Result ", username, result.isLoggedIn))
    res.status(200).send(result)
  } else {
    res.status(403).send({
      error: 'Please provide both a username and password'
    })
  }
})

// spin up http server
app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})
