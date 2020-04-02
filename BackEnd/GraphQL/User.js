var UserModel = require('../mongo/model/user');

// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

var retrieveUser = function ({ username }, context) {
    var usernamePetition = context.response.locals.user;

    return UserModel.findOne({ username: username },
        function (err, user) {
            if (err) return console.error(err);
        });
}

var createUser = function ({ username, name, email, password }) {
    //Encriptamos la contraseņa
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest('hex');

    var user = new UserModel({ username: username, name: name, email: email, password: password });
    user.save(function (err, user) {
        if (err) return console.error(err);
    });
    return user;
}

module.exports = {
    retrieveUser: retrieveUser,
    createUser: createUser
};
