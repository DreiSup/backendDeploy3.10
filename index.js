const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

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


app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${phoneList.length} people</p>
         <p>${date}</p>
        `
    )
})


app.get('/api/persons', (request,response) => {
    response.json(phoneList)
})

app.get('/api/persons/:id', (request,response) => {
    console.log(request.params.id)

    const id = request.params.id
    const person = phoneList.find(person => person.id === id )

    if (!person) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    response.json(person)

})

app.post('/api/persons', (request, response) => {
    try{

        const person = request.body
        console.log(request.body)
        
        
        const randomId = Math.floor(Math.random() * 100)
        
        const findName = () =>{
           return phoneList.find(p => p.name === person.name)
        } 
        

        if (!person.name || !person.number) {
            response.status(400).json({error: 'Content is missing'})
            return
        } 
        if (findName()) {
            response.status(400).json({error: 'Name already exists'})
            return
        }


        person.id = String(randomId)
        phoneList = phoneList.concat(person)
        response.json(person)

    }
    catch (error) {
        response.status(400).json({error: error.message})
    }
})

app.delete('/api/persons/:id', (request, response) => {

    const id = request.params.id
    phoneList = phoneList.filter(person => person.id !== id)

    console.log(`${id} has been removed`)
    response.status(204).json(`${id} has been removed`).end()
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)  
})