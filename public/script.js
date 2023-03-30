const main = async () => {
  const url = '/books';
  const booksUl = document.querySelector('#books');

  const books = await fetch(url).then((r) => r.json()).catch((e) => alert.error(e));
  books.forEach(({ title }) => {
    booksUl.insertAdjacentHTML('afterBegin', `<li>${title}</li>`);
  });
};

main();
