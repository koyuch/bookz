'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('book_author', [{
      bookId: 1,
      authorId: 1
    },{
      bookId: 2,
      authorId: 1
    },{
      bookId: 3,
      authorId: 1
    },{
      bookId: 3,
      authorId: 2
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('book_author', null, {});
  }
};
