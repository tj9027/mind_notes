# Mind Notes

This is a Next.js project capable of listing quick notes.

## Key Features

1) Add notes with a button.

2) Edit notes directly from widget.

3) Delete notes with a single click

4) Persistent notes

5) Github actions

6) Unit tests

## Getting Started

##### Prerequisites

- Node.js (v16 or later)
- npm or yarn (package manager)
- Prisma CLI (for database migrations)

##### Run Locally

- install dependencies without database
  - navigate to this folder location from terminal
  - run `npm i` or `yarn` from terminal
  - install db from prisma schema
    - delete file `/prisma/dev.db`
    - run `npx prisma db push` to create database from schema
    - run `npx prisma generate` to generate prisma client
    - to visualize the database: `npx prisma studio`
  - run `npm dev` and open browser to `http:localhost:3000`

- install dependencies using existing database
	- navigate to this folder location from terminal
 	- run `npm i` or `yarn` from terminal
    - run `npx prisma generate` to generate prisma client
    	- to visualize the database: `npx prisma studio`
  	- run `npm dev` and open browser to `http:localhost:3000`

- test locally
	- navigate to this folder location from terminal
 	- run `npm i` or `yarn` from terminal
	- run `npm run test` to start test
	- press `q` from terminal to quit test

### Possible Improvements

- better tests
- error handling
- e2e testing
- more robust types
- more validation / security
- clean data for better data storage
- improve widget capabilities (text styles / text editor / markup options)
- environment variables in config 
- ci/cd test and deployment
- docker
- ui/ux
- migrate to a proper database
- authentication
- better async data handler
- better folder organisation
- remove unneccessary components
