'use strict';

//////////////////////////////////////////////////////////////////////////
///////////////// Define Constants for Contact App //////////////////////
/////////////////    server side 'in memory' db    //////////////////////
////////////////////////////////////////////////////////////////////////

const clone = require('clone')
const config = require('./config')

// unit test db
const db = {}

// unit test data
const defaultData = {
  permissions: [
    {
      role: 'guest',
      password: 'guest',
      memberid: 'unknown',
      isLoggedIn: false
    }
  ]
}
// mock login function -- WILL BE REFACTORED

const isLoggedIn = (token) => {
  if (db[token]) return true
  return false
}

const get = (token) => {
  let data = db[token]
  if (data == null) {
    data = db[token] = clone(defaultData)
  }
  return data
}

const verify = (token, username, password) => {
  if (isLoggedIn(token)) return {isLoggedIn: true}

  let foundRole = false

  let roleObj = {
    role: username,
    password: password,
    memberid: 'unknown',
    isLoggedIn: true
  }

  get(token).permissions.map((p) = {
    if (p.role == username) {
      p.isLoggedIn = true
      return {isLoggedIn: true}
      }
    })

  get(token).permissions.push(roleObj)

  return (isLoggedIn: true}
}


module.exports = {
  verify
}
