[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24218469&assignment_repo_type=AssignmentRepo)

# News Aggregator API

This is my submission for Assignment 2 of the backend engineering launchpad. It's a Node.js + Express API that lets a user sign up, log in, save their news preferences, and then fetch news headlines based on those preferences.

## What it does

- Users can sign up and log in (passwords are hashed with bcrypt, auth is handled with JWT)
- Logged in users can set/update their news preferences (like categories they're interested in)
- Users can fetch news using the NewsAPI based on those preferences
- Routes that need auth are protected using a middleware that checks the JWT token

## Tech stack

- Node.js + Express
- MongoDB with Mongoose
- bcrypt for password hashing
- jsonwebtoken for auth
- newsapi (npm package) to actually pull the news
- dotenv for environment variables
- Jest + Supertest for testing (I originally wrote the tests with `tap` since that's what the starter repo had, but switched everything over to Jest)

## How to run it

1. Clone the repo
2. Run `npm install`
3. Add a `.env` file in the root with:
   ```
   NEWS_API_KEY=your_newsapi_key
   JWT_KEY=your_jwt_secret
   MONGO_URI=your_mongodb_connection_string
   ```
4. Run `npm run dev` to start the server (uses nodemon)

## Running tests

```
npm run test
```

This runs the Jest test suite in `test/server.test.js`, which covers signup, login, preferences (get/update), and the news endpoint, including checking that protected routes reject requests without a token.

## API Routes

**Auth**
- `POST /users/signup` — create a new user
- `POST /users/login` — log in, returns a JWT

**Preferences** (need `Authorization: Bearer <token>` header)
- `GET /users/preferences` — get the logged in user's preferences
- `PUT /users/preferences` — update preferences (send `{ preferences: [...] }`)

**News** (need auth too)
- `GET /news` — get top headlines based on query params (defaults to US if nothing is passed)

## Things I ran into while building this

Honestly this assignment took longer than I expected, mostly because of small bugs that were hard to spot:

- My `preferences` field wasn't actually saving even though the request said 200 — turned out I forgot to add `preferences` to the User schema in Mongoose, so it was silently getting dropped since Mongoose ignores fields not defined in the schema.
- I originally had a separate `Preference` model with fields like category/country/language, but that didn't match what the preferences feature was actually supposed to do, so I ended up just storing preferences as an array directly on the User model instead. Simpler and matched what the tests expected anyway.
- The news route was returning NewsAPI's list of sources instead of actual articles because I was calling `sources()` instead of `topHeadlines()`. Also had a typo in a function name (`getTopHeadLines` vs the SDK's actual `topHeadlines`) that took a minute to catch.
- Login was returning 400 for wrong password when it should've been 401 — small thing but the tests caught it right away.
- Also had to fix a duplicate key error on signup because my test user's email already existed in the DB from a previous test run — needed to check for existing users properly and handle that case with a 409 instead of crashing.

## Notes to self for later

- Should probably add proper cleanup in the test file so re-running tests doesn't fail because of leftover data from previous runs
- Could add more validation on the preferences endpoint (right now it just checks it's an array, doesn't validate the actual values)
- The default country fallback for news (`us`) is hardcoded, would be nicer to base it on the user's saved preferences automatically instead of query params
