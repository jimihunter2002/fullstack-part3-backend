const mongoose = require('mongoose');

require('dotenv').config();

console.log(process.env.MONGODB_URI);
const mongoUrlStart = process.env.MONGODB_URI;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const mongoUrlEnd = process.env.MONGODB_URI_END;

const url = `${mongoUrlStart}${username}:${password}${mongoUrlEnd}`;

console.log('connecting to DB...', url);

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to DB');
  })
  .catch(err => console.log(err.message));

//create schema
// const phonebookSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

//schema validation
const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,

    validate: {
      validator: v => {
        return v.length >= 8 && /^(\d{2,3}-?)\d{5,}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`,
    },
    required: [true, 'Phone number required'],
  },
});

//transform to remove __v and _id
phonebookSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model('Phonebook', phonebookSchema);
