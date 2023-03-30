const { generateId } = require('./utils');

class Book {
  static #all = [];

  constructor(title) {
    this.id = generateId();
    this.title = title;

    Book.#all.push(this);
  }

  static list() {
    return Book.#all;
  }

  static find(bookId) {
    return Book.#all.find(({ id }) => id === bookId);
  }

  static editTitle(id, newTitle) {
    const book = Book.find(id);
    if (!book) return null;
    book.title = newTitle;
    return book;
  }

  static delete(bookId) {
    const bookIdx = Book.#all.find(({ id }) => id === bookId);
    if (bookIdx) return null;

    Book.#all.splice(bookIdx, 1);
    return true;
  }

  static deleteAll() {
    if (!Book.#all.length) return null;

    Book.#all.length = 0;
    return Book.#all;
  }
}

module.exports = Book;
