//import mongoose from 'mongoose';
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide password and or name and phone number to be added to the phonebook: node mongo.js <password> [<name>] [<phone number>]',
  );
  process.exit(1);
}
const username = 'jimihunter007';
const password = process.argv[2];
let name = process.argv[3] !== undefined ? process.argv[3] : undefined;
let phoneNumer = process.argv[4] !== undefined ? process.argv[4] : undefined;

const url = `mongodb+srv://${username}:${password}@cluster0.pjjgpom.mongodb.net/phoneApp?retryWrites=true&w=majority`;

// create schema
const phonebookSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

// create model
const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if (name === undefined || phoneNumer === undefined) {
  mongoose
    .connect(url)
    .then(() => {
      Phonebook.find({}).then(contacts => {
        contacts.forEach(contact => {
          console.log(`${contact.name} ${contact.number}`);
        });
        return mongoose.connection.close();
      });
    })
    .catch(err => console.log(err));
} else {
  // connect to db and create phone object from model
  mongoose
    .connect(url)
    .then(() => {
      //create phonebook object from model
      const phonebook = new Phonebook({
        id: 5,
        name: name,
        number: phoneNumer,
      });
      return phonebook.save();
    })
    .then(() => {
      console.log(`added ${name} number ${phoneNumer} to phonebook`);
      return mongoose.connection.close();
    })
    .catch(err => console.log(err));
}
