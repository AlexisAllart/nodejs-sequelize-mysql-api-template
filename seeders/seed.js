const {
  faker
} = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// BEGIN SEED CONFIGURATION
NUMBER_OF_USERS = faker.number.int({
  min: 100,
  max: 400
});
// END SEED CONFIGURATION

let users = [];
for (let i = 0; i < NUMBER_OF_USERS; i++) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const userName = faker.internet.userName({
    firstName: firstName,
    lastName: lastName
  });
  const email = faker.internet.email({
    firstName: firstName,
    lastName: lastName
  });
  const unhashedPassword = faker.internet.password();
  const password = bcrypt.hashSync(unhashedPassword, saltRounds);
  const description = unhashedPassword;
  const role = Math.random() < 0.1 ? 'admin' : 'user';
  const random = Math.random();
  let status;
  switch (true) {
    case random < 0.5:
      status = 'offline';
      break;
    case random < 0.6:
      status = 'busy';
      break;
    case random < 0.7:
      status = 'away';
      break;
    default:
      status = 'online';
  }
  const picture = faker.image.avatarLegacy();
  const lastLogin = status != 'offline' ? faker.date.recent() : faker.date.past();
  const lastLogout = status == 'offline' ? faker.date.recent() : faker.date.past();
  const user = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: password,
    description: description,
    role: role,
    status: status,
    picture: picture,
    lastLogin: lastLogin,
    lastLogout: lastLogout,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.push(user);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};