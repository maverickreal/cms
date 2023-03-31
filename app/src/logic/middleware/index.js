const { verify, sign } = require('jsonwebtoken');

let uidToJwt = {}, jsk = process.env.JWTSECRETKEY;

const assignToken = user => {
    const jwtToken = sign(user, jsk, { expiresIn: '7d' });
    user.token = jwtToken;
    uidToJwt[user.userId] = jwtToken;
}

const invalidate = userId => {
    delete uidToJwt[userId];
}

const auth = (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'],
              user = verify(token, jsk),
              realToken = uidToJwt[user.userId];

        if(realToken!==token){
            return res.status(401).send({ status: 'error', message: 'authentication failed' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send({ status: 'error', message: 'authentication failed' });
    }
};

module.exports = {assignToken, auth, invalidate};