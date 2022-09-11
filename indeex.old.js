//import cors from 'cors';
//import express from 'express';
//import morgan from 'morgan';
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const server = express();

//for parsing request body
server.use(express.json());
server.use(cors());
server.use(express.static('build'));

server.set('json spaces', 2);

//middleware
// const requestLogger = (req, res, next) => {
//   console.log('Method', req.method);
//   console.log('Path', req.path);
//   console.log('Body', req.body);
//   console.log('---');
//   next();
// };

// morgan logger
morgan.token('body', req => {
  return JSON.stringify(req.body);
});

//logger middleware
server.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

//server.use(requestLogger);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// const generateId = () => {
//   return Math.floor(Math.random() * 123456789);
// };

server.get('/api/persons', (req, res) => {
  res.json(persons);
});

server.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send(`Contact with id: ${id} not found in phonebook`);
  }
});

server.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    persons = persons.filter(p => p.id !== id);
    res.status(204).json(person);
  } else {
    res.status(404).send('Contact does not exist');
  }
});

server.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }
  const isNameExisiting = persons.find(p => p.name === body.name);
  if (isNameExisiting) {
    return res.status(400).json({ error: 'name must be unique' });
  }
  const newPerson = {
    name: body.name,
    number: body.number,
    //id: generateId(),
  };

  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});

server.get('/info', (req, res) => {
  const contacts = persons.length;
  const dateInfo = new Date().toString();
  console.log(typeof dateInfo);
  res.write(`<p>Phonebook has info for ${contacts} people</p><br/>${dateInfo}`);
  res.end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

server.use(unknownEndpoint);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Express server is running on ${PORT}`);
});
