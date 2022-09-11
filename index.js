const cors = require('cors');
require('dotenv').config();
const express = require('express');

const morgan = require('morgan');
const Person = require('./models/phonebook');

const server = express();

server.use(express.static('build'));
//for parsing request body
server.use(express.json());
server.use(cors());

server.set('json spaces', 2);

// morgan logger
morgan.token('body', req => {
  return JSON.stringify(req.body);
});

//logger middleware
server.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

// const generateId = () => {
//   return Math.floor(Math.random() * 123456789);
// };

server.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(err => next(err));
});

server.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res
          .status(404)
          .send(`Contact with id: ${req.params.id} not found in phonebook`);
      }
    })
    .catch(err => next(err));
});

server.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id, (err, doc) => {
    if (doc === null) {
      return res
        .status(404)
        .send(`Person with id ${req.params.id} does not exist`);
    }
    if (err) {
      console.log(err.message);
    } else {
      console.log(doc);
      return res.status(204).json(doc);
    }
  });
});

server.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  console.log(body);

  const newContact = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, newContact, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedContact => {
      res.json(updatedContact);
    })
    .catch(err => next(err));
});

server.post('/api/persons', (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.status(400).json({ error: 'name or number is missing' });
    return;
  }

  Person.find({})
    .then(persons => {
      const isNameExisitng = persons.find(p => p.name === body.name);
      if (isNameExisitng) {
        res.status(400).json({ error: 'name must be unique' });
        return;
      } else {
        const newPerson = Person({
          name: body.name,
          number: body.number,
        });

        newPerson
          .save()
          .then(savedPerson => {
            return res.status(201).json(savedPerson);
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

server.get('/info', (req, res, next) => {
  Person.find({})
    .then(results => {
      res.write(
        `<p>Phonebook has info for ${
          results.length
        } people</p><br />${new Date().toString()}`,
      );
      res.end();
    })
    .catch(err => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

server.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }
  next(err);
};
server.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Express server is running on ${PORT}`);
});
