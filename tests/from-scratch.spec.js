const request = require('supertest');
const path = require('path');
const ScoreCounter = require('score-tests');
const app = require('../src/server');

const testSuiteName = 'From Scratch Tests';
const scoresDir = path.join(__dirname, '..', 'scores');
const scoreCounter = new ScoreCounter(testSuiteName, scoresDir);

describe(testSuiteName, () => {
  afterEach(async () => request(app).delete('/books'));

  it('GET /books sends an empty array if no books exist', async () => {
    const res = await request(app).get('/books');
    expect(res.body.length).toBe(0);
    expect(res.status).toEqual(200);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('GET /books sees all tasks', async () => {
    const bookTitle1 = 'Wizard of Oz';
    const bookTitle2 = 'The Hobbit';
    await request(app)
      .post('/books')
      .send({ title: bookTitle1 })
      .set('Accept', 'application/json');

    await request(app)
      .post('/books')
      .send({ title: bookTitle2 })
      .set('Accept', 'application/json');

    const res = await request(app).get('/books');
    expect(res.body.length).toBe(2);
    expect(res.status).toEqual(200);

    const [task1, task2] = res.body;

    expect(task1.id).toBeGreaterThan(0);
    expect(task1.title).toBe(bookTitle1);
    expect(task2.id).toBeGreaterThan(0);
    expect(task2.title).toBe(bookTitle2);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('POST /books creates a book', async () => {
    const bookTitle = 'Shrek';
    const res = await request(app)
      .post('/books')
      .send({ title: bookTitle })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(201);
    const { id, title } = res.body;
    expect(id).toBeGreaterThan(0);
    expect(title).toBe(bookTitle);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('GET /books/:id sees a specific book', async () => {
    const bookTitle1 = 'Wizard of Oz';
    const bookTitle2 = 'The Hobbit';
    await request(app)
      .post('/books')
      .send({ title: bookTitle1 })
      .set('Accept', 'application/json');

    await request(app)
      .post('/books')
      .send({ title: bookTitle2 })
      .set('Accept', 'application/json');

    const res = await request(app).get('/books');

    const [book1, book2] = res.body;

    const res1 = await request(app).get(`/books/${book1.id}`);
    const wizardBook = res1.body;

    expect(res1.status).toEqual(200);
    expect(wizardBook.id).toBeGreaterThan(0);
    expect(wizardBook.title).toBe(bookTitle1);

    const res2 = await request(app).get(`/books/${book2.id}`);
    const hobbitBook = res2.body;

    expect(res2.status).toEqual(200);
    expect(hobbitBook.id).toBeGreaterThan(0);
    expect(hobbitBook.title).toBe(bookTitle2);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('GET /books/:id sends a 404 if no book exists', async () => {
    const { status, body } = await request(app).get('/books/123223');

    expect(status).toEqual(404);
    expect(body).toEqual({});

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('PATCH /books/:id updates a title', async () => {
    const title = 'Fellowship of the Ring';
    const newTitle = 'The Return of the King';

    const createRes = await request(app)
      .post('/books')
      .send({ title })
      .set('Accept', 'application/json');

    const { id } = createRes.body;

    const updateRes1 = await request(app)
      .patch(`/books/${id}`)
      .send({ title: newTitle });

    expect(updateRes1.status).toEqual(200);
    expect(updateRes1.body.id).toBe(id);
    expect(updateRes1.body.title).toBe(newTitle);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('PATCH /books/:id returns 404 if task does not exist', async () => {
    const updateRes = await request(app)
      .patch('/books/1234')
      .send({ title: 'Does not matter' });

    expect(updateRes.status).toEqual(404);
    expect(updateRes.body).toEqual({});

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('DELETE /books/:id deletes an existing book', async () => {
    const title = 'Dune';
    const createRes = await request(app)
      .post('/books')
      .send({ title })
      .set('Accept', 'application/json');

    const { id } = createRes.body;

    const deleteRes = await request(app).delete(`/books/${id}`);

    expect(deleteRes.status).toEqual(204);
    expect(deleteRes.body).toEqual({});

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('DELETE /books/:id returns 404 if book does not exist', async () => {
    const deleteRes = await request(app).delete('/books/100');

    expect(deleteRes.status).toEqual(404);
    expect(deleteRes.body).toEqual({});

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  // IGNORE PLEASE
  beforeEach(() => scoreCounter.add(expect));
  afterAll(scoreCounter.export);
});
