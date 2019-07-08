'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('author', [{
        firstName: 'Fero',
        lastName: 'Sparatko'
      },{
        firstName: 'Ilona',
        lastName: 'Csakova'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('author', null, {});
  }
};
