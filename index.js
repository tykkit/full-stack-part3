require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('content', function getContent (request) {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    } else {
        return " "
    }
})

app.use(morgan(`:method :url :status - :response-time ms :content`))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  
app.use(errorHandler)

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


const now = new Date(Date.now())
const dateString = `${dayNames[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} GMT+0200 (Eastern European Standard Time)`

let phonebook = [
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

const generateId = () => {
    const newId = phonebook.length > 0
        ? Math.random(phonebook.length + 100000)
        : 0
    return String(newId)
}

app.get('/', (request, response) => {
    response.send('<h1> Hello World! </h1>')
})

app.get('/api/phonebook', (request, response) => {
    Number.find({}).then(numbers => {
        response.json(numbers)
    })
})

app.get('/info', (request, response) => {
    Number.find({}).then(numbers => {
        response.send(
            `<div> Phonebook has info for ${numbers.length} people` + 
            `<div> ${dateString} </div>`
        )
    })
    .catch(error => next(error))
})

app.get('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    Number.findById(id)
        .then(returnedNumber => {
            response.json(returnedNumber)
        })
        .catch(error => next(error))
})

app.post('/api/phonebook', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const isAdded = phonebook.find(person => person.name === body.name || person.number === body.number)

    if (!isAdded) {
        const number = new Number({
            name: body.name,
            number: body.number,
        })

        number.save()
            .then(savedNumber => {
                response.json(savedNumber)
            })
            .catch(error => next(error))
    
    } else {
        response.status(400).json({
            error: 'name and number must be unique'
        })
    }
})

app.put('/api/phonebook/:id', (request,response, next) => {
    const newNumber = {
        name: request.body.name,
        number: request.body.number
    }
    Number.findByIdAndUpdate(request.params.id, newNumber, {new: true})
        .then(updatedNumber => {
            response.json(updatedNumber)
        })
        .catch(error => next(error))
})

app.delete('/api/phonebook/:id', (request, response, next) => {
    const id = String(request.params.id)
    Number.findByIdAndDelete(id)
        .then(result =>{
            response.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})