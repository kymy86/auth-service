# Authentication micro-service

[![Build Status](https://travis-ci.org/kymy86/auth-service.svg?branch=master)](https://travis-ci.org/kymy86/auth-service)

This is a NodeJS authentication micro-service that uses json web token as authentication method.

You need to set-up your environment variables in the **.env** file and than
you can start-up the micro-service with `docker-compose up`

**N.B.** In development environement, the db is pre-populated with a test user;

- Username: kymy@test.com 
- Password: password