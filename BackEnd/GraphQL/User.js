var UserModel = require('../mongo/model/user');
var logger = require('../logger.js');

var {GraphQLError } = require('graphql');

// Standard FIPS 202 SHA-3 implementation
const { SHA3 } = require('sha3');

var retrieveUser = function ({ username }, context) {
    var usernamePetition = context.response.locals.user;

    return UserModel.findOne({ username: username }).orFail(() => new GraphQLError(`User ${username} not found`), logger.error(`Username ${username} not found`));
}

var createUser = function ({ username, name, email, password }, context) {
    var usernamePetition = context.response.locals.user;

    //Encriptamos la contrase�a
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest('hex');

    var user = new UserModel({ username: username, name: name, email: email, password: password });


    return new Promise((resolve, reject) => {
        user.save().then((user) => {
            resolve(user);
        }).catch((err) => {

            logger.error(err);
            reject(new GraphQLError(`User ${username} already exists`));
        });
    });
}

module.exports = {
    retrieveUser: retrieveUser,
    createUser: createUser
};
