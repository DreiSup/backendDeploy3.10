require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./person')

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const date = new Date();

 let phoneList = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
] 


app.get('/', (request, response) => {
    response.send('<h1>To access the api, /api/persons</h1>')
})


app.get('/info', (request, response, next) => {

    response.send(
        `<p>Phonebook has info for ${phoneList.length} people</p>
         <p>${date}</p>
        `
    )
})


app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(person => {
            response.json(person)
        })
        .catch (error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id)

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch (error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    try{

        const body = request.body
        console.log('Body: ', body)


        const person = new Person({
            name: body.name,
            number: body.number
        })

        person.save().then(savedPerson => {
            response.json(savedPerson, 'hello mf')
        })

    }
    catch (error) {
        next(error)
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    console.log(request.body)

    Person.findById(request.params.id)
        .then(person => {
            if(!person) {
                return response.status(404).end()
            }

        person.name = name
        person.number = number

        return person.save().then((updatedPerson) => {
            response.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)  
})