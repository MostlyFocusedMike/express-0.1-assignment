# Express-1.1 Assignment
Building a CRUD server

- [Express-1.1 Assignment](#express-11-assignment)
- [Overview: How to read what we already have](#overview-how-to-read-what-we-already-have)
  - [Where to start?](#where-to-start)
  - [index.js: Starting server](#indexjs-starting-server)
  - [server.js: Required modules](#serverjs-required-modules)
  - [server.js: Static Assets and Body Parsing](#serverjs-static-assets-and-body-parsing)
  - [server.js: our Model middleware](#serverjs-our-model-middleware)
  - [server.js: DELETE all route](#serverjs-delete-all-route)
  - [model-book.js](#model-bookjs)
- [Question 1: GET /books](#question-1-get-books)
- [Question 2: POST /books](#question-2-post-books)
- [Question 3: GET /books/:id](#question-3-get-booksid)
- [Question 4: PATCH /books/:id](#question-4-patch-booksid)
- [🚨 DEBUG: Fix Book.delete()! 🚨](#-debug-fix-bookdelete-)
- [Question 5: DELETE /books/:id](#question-5-delete-booksid)
- [Bonus:  Fetch to create](#bonus--fetch-to-create)


Welcome to the world of Express! As you'll see in the next few days, it's a lot to cover, but luckily it's all patterns! And the heart of Express patterns is CRUD
- Create = Make new resources
- Read = Load existing resources
- Update = Take an existing resource and modify it
- Delete = Destroy resources

Once you get a feel for CRUD, you'll be amazed how much of the web is built off these 4 simple actions.

# Overview: How to read what we already have
BEFORE you skip down to the questions section of the page, let's talk about what we *already* have in this repo. A lot more than usual!

> **Don't worry, no matter how many files there are, we always take it one piece at a time**

## Where to start?
Whenever dropping into a new repo with existing code Look first in the `package.json` for a starting point (usually whatever `npm start` refers to). What does it say? It looks like it points to `src/index.js` let's start there. (Remember `nodemon` is the same as `node` it just restarts our server on save, so we don't have to.)

## index.js: Starting server
Looks like we are `requiring` some kind of a server object, and all we're doing in `index.js` is getting it started. We're using [environment variables](https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/) to read `PORT` and `HOST`, but setting defaults. It also looks like our `listen` callback is being nice and giving us a final link to the console we can cut and copy when we start our server. The only thing we're importing is `server.js`, lets look at that next.

## server.js: Required modules
At the top of the file is where we require (sometimes called "importing") all the different modules for that file. Here we have the `express` package, something called `path` and `model-books`. Hmm, before diving into those, it can be helpful to read *this* file to gain more context. Let's continue in `server.js` for now.

## server.js: Static Assets and Body Parsing
So it looks like we're using `express` and `path` to handle our `Static Assets` with some built in [middleware](https://expressjs.com/en/guide/writing-middleware.html).

```js
const app = express();

const publicDir = path.join(__dirname, '..', 'public');
const staticServer = express.static(publicDir);
app.use(staticServer);

app.use(express.json());
```

Don't worry too much about these yet, just know that [express.static](https://expressjs.com/en/starter/static-files.html) means when we go to `http://localhost:8080` we'll be able to see our `index.html` and assets in the `public` file. And `express.json()` lets us parse out the `req.body` property. Remember since both have `app.use()` without a file path, *they apply to the whole app*.

> Remember, order matters when registering routes and middleware! First registered, first hit.

## server.js: our Model middleware
This is our custom middleware, all it does is make sure all requests after this have a `req.Book` property.

## server.js: DELETE all route
Looks like the only other thing left in `server.js`, besides the export, is a delete route. There's a comment that we just need this for testing. Alright, makes sense, maybe we can reference some things in this later like `.status` and `.send`.

## model-book.js
A "Model" is a class that refers specifically to a real thing, or "entity." So like, a class that handles fetches probably wouldn't be called a model, but a class that tracks what books we have would definitely be called the `Book` model. And it looks like this model is responsible for some helpful methods like creating, reading, updating, and deleting books. ...wait that's CRUD!

You may not be super comfortable with [Static class methods](https://www.w3schools.com/js/js_class_static.asp), but all you need to know is that the *class* `Book` has methods on it that *don't* require the `new` keyword to use.

```js
const theHobbit = new Book('The Hobbit');

console.log(Book.list());
// [ Book { id: 1, title: 'The Hobbit' } ]
console.log(Book.find(theHobbit.id));
// { id: 1, title: 'The Hobbit' }
console.log(Book.editTitle(theHobbit.id, 'The Hobbit 2'));
// { id: 1, title: 'The Hobbit 2' }
console.log(Book.delete(theHobbit.id));
// true
console.log(Book.list());
// []
```

OK! Let's run `npm start` in our terminal, get our Postman ready for queries, and let's start building! You can also do `npm run test:w` to have jest continuously test your server on save.

> NOTE: We are *so* close to databases, but for now our data is saved **in memory** what this means is that

# Question 1: GET /books
First up, lets create a route that returns a list of all our books. Let's make it a `GET` request because we don't need to *send* any data, we're just requesting it. If we have no books, then our API should send back an empty array.

- **HTTP Verb:** GET
- **url:** /books
- **expected response:** An array of `Books` or an empty array
- **status code**: Always `200`

If you need some clues about `send`ing responses and `status` codes, check out the `delete` route!

----------------------------------------------------------------


# Question 2: POST /books
Now that we can read our books, we should be able to send over some data and create them. If we `POST`ed data like

```json
{ "title": "The Great Gatsby" }
```

We would expect our server to return that information *plus* an id:
```json
{ "id":1, "title": "The Great Gatsby" }
```

Also, since we're creating a resource, we want a status code of `201`. [Look at the cats for fun](https://http.cat)

- **HTTP Verb:** POST
- **url:** /books
- **expect request:** An object with a `title` property
- **expected response:** A single `Book` object with an `id` and `title` property
- **status code**: Always `201`

I'm telling you exactly what we need now, because you're new, but on the job reading tests is a great place to find this info. Check out ours and you'll see!

----------------------------------------------------------------


# Question 3: GET /books/:id
Now it's time to get into using dynamic routing with [route parameters](https://expressjs.com/en/guide/routing.html#route-parameters). In order to get a *single* specific book, we have to send over the book's id in the url as a `parameter`. Remember, parameters are like function arguments, they can be dynamic.

So if I made a get request to `/books/2`, I would expect:

```json
{ "id": 2, "title": }
```

However, what if someone requests a resource that doesn't exist? In that case we want to send a 404, and a body that's just the text "Not Found"

- **HTTP Verb:** GET
- **url:** /books/:id
- **expected response:** A single `Book` object with an `id` and `title` property OR the text "Not Found"
- **status code**: Either `200` or `404`

> HINT: I bet there's a specific method that can *just* send a status Code and auto set the body text. Perhaps...we're already using it in the starter code?

----------------------------------------------------------------


# Question 4: PATCH /books/:id
Here we are, the *hardest* kind of request. It takes a specific HTTP verb, a dynamic route for an id, body data in the request, *and* sends a 404 if there was no resource to update.

So if a resource exists, and we hit `/books/3` with a `PATCH` and this body:

```json
{ "title": "The Hunger Games: More money Edition" }
```

we would expect back a `200` status, and the updated record:

```json
{ "id": 3, "title": "The Hunger Games: More money Edition" }
```

If however we hit a non-existent id, `/books/123123`, we just get a `404` and a `Not Found` body.

- **HTTP Verb:** PATCH
- **url:** /books/:id
- **expect request:** An object with a `title` property
- **expected response:** A single `Book` object with an `id` and `title` property OR the text "Not Found"
- **status code**: Either `200` or `404`

Notice that the id is in the route parameter and not the body. With a `PATCH` request, the id isn't usually required (if the API is sticking to conventions).

# 🚨 DEBUG: Fix Book.delete()! 🚨
Ah, shoot. I just noticed we can't build our `DELETE` route until we fix the underlying `Book.delete` method. Check out the `/tests/debug.spec.js` file and read the tests to see what's failing. Pop some `console.logs` into the test file itself to see what's wrong (or make a `playground.js` file to mess around). But ideally, we should be able to pass an id into `Book.delete()` and *only* that book should be deleted.

# Question 5: DELETE /books/:id
OK! Now that the `Book.delete()` is fixed, let's make the last route. What's interesting about the `DELETE` route is that there shouldn't be *anything* returned other than a `204` code if something was successfully deleted.

So `DELETE` to `/books/2` would return an empty body and a 204. If there wasn't anything to delete in the first place, you *should* send a `404`. That means `DELETE` to `/books/123123123` would return a `404` and

```json
"Not found"
```

- **HTTP Verb:** PATCH
- **url:** /books/:id
- **expect request:** An object with a `title` property
- **expected response:** An empty response OR the text "Not Found"
- **status code**: Either `204` or `404`

You would think deleting something and not deleting nothing would return the same code, but no! It's helpful to know if a resource never existed in the first place.

# Bonus:  Fetch to create
Hungry for more? If you've got 10/10 test coverage, here's a challenge for you: creat a form in `/public/index.html` to create a new book.

It should have:
- A label
- A text input
- A submit button that sends `{ "title": "whatever" }` via `POST`
- On a successful submission, clear the form, and re-render the books to see your new book!

Only attempt the bonus if you *fully* understand everything about the server.
