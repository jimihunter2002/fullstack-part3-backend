const phonebookRouter = require('express').Router();
const phonebookInfo = require('express').Router();
const Person = require('../models/phonebook');

phonebookRouter.get('/', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(err => next(err));
});

phonebookRouter.get('/:id', (req, res, next) => {
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

phonebookRouter.delete('/:id', (req, res) => {
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

phonebookRouter.put('/:id', (req, res, next) => {
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

phonebookRouter.post('/', (req, res, next) => {
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

phonebookInfo.get('/info', (req, res, next) => {
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

module.exports = { phonebookRouter, phonebookInfo };
