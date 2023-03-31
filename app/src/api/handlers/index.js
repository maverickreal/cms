const db = require('../../data/index.js'),
    { v4: uuid } = require('uuid'),
    { assignToken, invalidate } = require('../../logic/middleware/index.js'),
    { checkEmail, checkPassword, getNum } = require('../../logic/utility/index.js')

const signUpChecks = (firstName, lastName, email, password, res) => {
    if (!firstName || !lastName) {
        res.status(400).send({
            status: 'error',
            message: 'correct signup information not provided'
        });
        return false;
    }
    if (!checkEmail(email)) {
        res.status(400).send({
            status: 'error',
            message: 'invalid email address'
        });
        return false;
    }
    if(!checkPassword(password)){
        res.status(400).send({
            status: 'error',
            message: 'weak password'
        });
        return false;
    }
    return true;
}

const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if(!signUpChecks(firstName, lastName, email, password, res)){
            return;
        }
        const userObj = await db.getUserIfExists(email, null);
        if (userObj.user) {
            return res.status(400).send({
                status: 'error',
                message: 'credentials already in use'
            });
        }
        const userId = uuid();
        const user = await db.createUser(
            userId, firstName + ' ' + lastName, email, password
        );
        if (user === null) {
            throw 'db error';
        }
        assignToken(user);
        delete user.userId;
        res.status(200).send({
            status: 'ok',
            message: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!checkEmail(email) || !password) {
            return res.status(400).send({
                status: 'error',
                message: 'correct signin information not provided'
            });
        }
        const { error, user } = await db.getUserIfExists(email, password);
        if (error) {
            return res.status(500).send({
                status: 'error',
                message: error
            });
        }
        assignToken(user);
        delete user.userId;
        res.status(200).send({
            status: 'ok',
            message: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const signOut = async (req, res)=>{
    invalidate(req.user.userId);
    res.status(200).send({
        status:'ok'
    });
}

const getUser = async (req, res) => {
    try {
        const { error, profile } = await db.getUserProfile(req.user.userId);
        if(error){
            res.status(400).send({
                status: 'error',
                message: 'user not found'
            });
        }
        else{
            res.status(200).send({
                status: 'ok',
                message: profile
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const createContact= async (req, res) => {
    try {
        if (!req.body.name || !checkEmail(req.body.email)) {
            return res.status(400).send({
                status: 'error',
                message: 'correct contact description not provided'
            });
        }
        const contact = await db.createContact(uuid(), req.user.userId, req.body.name, req.body.email);
        res.status(200).send({
            status: 'ok',
            message: contact
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const deleteContact = async (req, res) => {
    try {
        let done = await db.deleteContact(req.user.userId, req.params['contactId']);
        if (!done) {
            res.status(500).send({ status: 'error' });
        }
        else {
            res.status(200).send({ status: 'ok' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const updateContact = async (req, res) => {
    try{
        const data = {};
        if(req.body.email){
            if(!checkEmail(req.body.email)){
                return res.status(400).send({
                    status : 'error',
                    message : 'correct email not provided'
                });
            }
            data.email = req.body.email;
        }
        if(req.body.name){
            data.name = req.body.name;
        }  
        if (!data.name && !data.email) {
            return res.status(400).send({
                status: 'error',
                message: 'update(s) not provided'
            });
        }
        let {error, contact} = await db.updateContact(
            req.user.userId, req.params['contactId'], data
        );
        if(error){
            res.status(404).send({
                status: 'error',
                message: error
            });
        }
        else{
            res.status(200).send({
                status: 'ok',
                message: contact
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({status: 'error'});
    }
}

const getContact = async (req, res) => {
    try {
        const contact = await db.getContact(req.params['contactId']);
        if (!contact) {
            res.status(404).send({
                status: 'error',
                message: 'contact not found'
            });
        }
        else {
            res.status(200).send({
                status: 'ok',
                message: contact
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const getUserContacts = async (req, res) => {
    try {
        const skip = getNum(req.query.skip), limit = getNum(req.query.limit);
        if(isNaN(skip) || isNaN(limit)){
            return res.status(400).send('skip/limit field(s) invalid.');
        }
        const contacts = await db.getContactsOfUser(skip, limit, req.user.userId);
        res.status(200).send({
            status: 'ok',
            message: contacts
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

module.exports = { signIn, signUp, getUser,
                   createContact, deleteContact, getContact,
                   getUserContacts, updateContact, signOut };