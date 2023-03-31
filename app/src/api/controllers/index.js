const router = require('express').Router(),
	  Handler = require('../handlers/index.js'),
	  { auth } = require('../../logic/middleware/index.js');

router.post('/signup', Handler.signUp);

router.post('/signin', Handler.signIn);

router.post('/signout', auth, Handler.signOut);

router.get('/user', auth, Handler.getUser);

router.post('/contact', auth, Handler.createContact);

router.delete('/contact/:contactId', auth, Handler.deleteContact);

router.put('/contact/:contactId', auth, Handler.updateContact);

router.get('/contact/:contactId', auth, Handler.getContact);

router.get('/contacts', auth, Handler.getUserContacts);

module.exports = router;