'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('book', [{
      title: 'Moj zivot',
      description: 'O zivote a tak..'
    },{
      title: 'Proc?',
      description: 'Preco je dobre byt sam sebou.'
    },{
      title: 'Kulisakoviny',
      description: 'Vychytavky Ladi Hrusky'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('book', null, {});
  }
};
