const MongoClient = require('mongodb').MongoClient;

let client = new MongoClient(
  `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`,
  {useNewUrlParser: true}), db = null;

const logAndNull = err => {
  console.log(err);
  return null;
}

const init = async () => {
  try {
    await client.connect();
    db = client.db(process.env.DBNAME);
    const toFlush = ( process.env.FLUSHDB==='true' );
    if(toFlush){
      await truncate();
    }
  } catch (error) {
    return logAndNull(error);
  }
};

const getUserIfExists = async (email, Password=null) => {
  try {
    const users = db.collection('users');
    const check = { email };
    if(Password!==null){
      check.password = Password;
    }
    const user = await users.findOne(check, {
      projection: { name: 1, email: 1, userId: 1}
    });
    if (user) {
      delete user._id;
      return { user };
    }
    return { error: 'user could not be found' };
  } catch (error) {
    return logAndNull(error);
  }
};

const createUser = async (userId, name, email, password) => {
  try {
    const users = db.collection('users');
    await users.insertOne({ userId, name, email, password, contacts: [] });
    return { name, email, userId };
  } catch (error) {
    return logAndNull(error);
  }
};

const getUserProfile = async userId => {
  try {
    const users = db.collection('users');
    const res = await users.findOne({ userId },
    { projection : { contactCount : { $size : '$contacts' },
    _id : 0, name : 1, email : 1 } } );
    if(res){
      return {profile : res};
    }
    return {error : 'user not found to exist'};
  } catch (error) {
    return logAndNull(error);
  }
}

const createContact = async (contactId, userId, name, email) => {
  try {
    const contacts = db.collection('contacts'), users = db.collection('users');
    await contacts.insertOne({
      contactId, name, email,
      userId, createdAt : new Date()
    });
    await users.updateOne({ userId }, { $push: { contacts: contactId } });
    return { contactId, name, email };
  } catch (error) {
    return logAndNull(error);
  }
};

const deleteContact = async (userId, contactId) => {
  try {
    const contacts  = db.collection('contacts'), users=db.collection('users');
    const res = await contacts.findOne({ contactId, userId });
    if (!res) {
      return {error : 'contact not found to exist'};
    }
    await contacts.deleteOne({ contactId });
    await users.updateOne(
      { userId },
      { $pull: { contacts: contactId } }
    );
    return {};
  } catch (error) {
    return logAndNull(error);
  }
}

const updateContact = async ( userId, contactId, data ) => {
  try{
    const contacts = db.collection('contacts');
    const res = await contacts.updateOne({ contactId, userId }, {$set: data});
    if(res.matchedCount!==1){
      return { error:'contact not found' };
    }
    return { contactId, ...data };
  } catch(error){
    return logAndNull(error);
  }
}

const getContact = async contactId => {
  try {
    const contacts = db.collection('contacts');
    const contact = await contacts.findOne(
      { contactId }, {projection : {userId : 0}
    });
    if (contact){
      delete contact._id;
    }
    return contact;
  } catch (error) {
    return logAndNull(error);
  }
}

const getContactsOfUser = async (skip, limit, userId) => {
  try {
    const contacts = db.collection('contacts');
    let cursor = contacts.find(
      { userId }, { projection : { name : 1,
      email : 1, contactId : 1, createdAt : 1 }
    });
    if(skip !== null){
      cursor = cursor.skip(skip);
    }
    if(limit !== null){
      cursor = cursor.limit(limit);
    }
    const contactsList = await cursor.toArray();
    return contactsList.map(contact => {
      delete contact._id;
      return contact;
    });
  } catch (error) {
    return logAndNull(error);
  }
}

const truncate = async () => {
  try{
    await db.collection('users').drop();
    await db.collection('contacts').drop();
  }
  catch(error){
    return logAndNull(error);
  }
}

module.exports={ init, getUserIfExists, createContact, createUser,
                 deleteContact, getContact, getContactsOfUser,
                 getUserProfile, updateContact };