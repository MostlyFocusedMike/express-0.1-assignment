/* eslint-disable no-new */
const path = require('path');
const ScoreCounter = require('score-tests');
const Book = require('../src/model-books');

const testSuiteName = 'Debug Tests';
const scoresDir = path.join(__dirname, '..', 'scores');
const scoreCounter = new ScoreCounter(testSuiteName, scoresDir);

describe(testSuiteName, () => {
  it('Deletes a book properly', () => {
    new Book('Shrek');
    new Book('Shrek');
    new Book('Shrek');
    const { id } = new Book('Shrek');

    const didDelete = Book.delete(id);
    expect(didDelete).toBe(true);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Returns truthy if book does exist, falsy otherwise', () => {
    const bookTitle = 'Shrek';
    const book = new Book(bookTitle);
    let didDelete = Book.delete(book.id);
    expect(didDelete).toBe(true);

    didDelete = Book.delete(123);
    expect(didDelete).toBeFalsy();

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  // IGNORE PLEASE
  beforeEach(() => scoreCounter.add(expect));
  afterAll(scoreCounter.export);
});
