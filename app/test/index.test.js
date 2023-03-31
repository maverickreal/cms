const app = require('../src/index.js'),
    st = require('supertest'),
    req = st(app);

//jest.setTimeout(100000);


describe('running tests', () => {

    test('testing signup', async () => {
        const res = await req.post('/signup').send({
            email: 'abc@xyz.org', firstName: 'fname',
            lastName: 'lname', password: 'password'
        });
        console.log(1, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('repeating  signup', async () => {
        const res = await req.post('/signup').send({
            email: 'abc@xyz.org', firstName: 'fname',
            lastName: 'lname', password: '#Mypassword9'
        });
        console.log(2, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('repeating  signup', async () => {
        const res = await req.post('/signup').send({
            email: 'abc@xyz.org', firstName: 'fname',
            lastName: 'lname', password: '&Yourpassword8'
        });
        console.log(3, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    let token = '';

    test('testing signing in', async () => {
        const res = await req.post('/signin').send({
            email: 'abc@xyz.org', password: '#Mypassword9'
        });
        console.log(4, res.body.message);
        expect(res.statusCode).toBe(200);
        token = res.body.message.token;
    });

    test('repeating sign-in test', async () => {
        const res = await req.post('/signin').send({
            email: 'abcd@xyz.org', password: '#Mypassword9'
        });
        console.log(5, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    let contactId = '';

    test('inserting 2 contacts', async () => {
        await req.post('/contact').send({
            name: 'name', email: 'abc@xyz.org', token
        });
        const res = await req.post('/contact').send({
            name: 'name', email: 'abc@xyz.org', token
        });
        console.log(6, res.body.message);
        contactId = res.body.message.contactId;
        expect(res.statusCode).toBe(200);
    });

    test('repeating contact creation', async () => {
        const res = await req.post('/contact').send({
            name: 'name', email: 'abc@xyz.org', token: 'avb'
        });
        console.log(7, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('testing contact fetching', async () => {
        const res = await req.get(`/contact/`).send({ token });
        console.log(8, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('fetching all contacts', async () => {
        const res = await req.get(`/contacts`).send({ token });
        console.log(9, res.body.message);
        expect(res.statusCode).toBe(200);
        expect(res.body.message.length).toBe(2);
    });

    test('deleting the last contact', async () => {
        const res = await req.delete(`/contact/${contactId}`).send({ token });
        contactId = '';
        console.log(10, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('repeating contact deletion', async () => {
        const res = await req.delete(`/contact/sudhf`).send({ token });
        console.log(11, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('repeating contact fetching', async () => {
        const res = await req.get(`/contact/${contactId}`).send({ token });
        console.log(12, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('repeating all contacts fetching', async () => {
        const res = await req.get(`/contacts`).send({ token });
        console.log(13, res.body.message);
        expect(res.statusCode).toBe(200);
        expect(res.body.message.length).toBe(1);
        contactId = res.body.message[0].contactId;
    });

    test('testing contact updation', async () => {
        const res = await req.put(`/contact/${contactId}`).send({
            token,
            name: 'alphaname',
            email: 'abc@xyz.org'
        });
        console.log(14, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('repeating contact updation', async () => {
        const res = await req.put(`/contact/${contactId}`).send({ token });
        console.log(15, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('logging out', async () => {
        const res = await req.post('/signout').send({ token });
        console.log(16, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('inserting contact', async () => {
        const res = await req.post('/contact').send({
            name: 'name', email: 'abc@xyz.org', token
        });
        console.log(17, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('testing contact fetching', async () => {
        const res = await req.get(`/contact/`).send({ token });
        console.log(18, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('fetching all contacts', async () => {
        const res = await req.get(`/contacts`).send({ token });
        console.log(19, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('deleting the last contact', async () => {
        const res = await req.delete(`/contact/${contactId}`).send({ token });
        console.log(20, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('testing contact updation', async () => {
        const res = await req.put(`/contact/${contactId}`).send({
            token,
            name: 'alphaname',
            email: 'abc@xyz.org'
        });
        console.log(21, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });
});