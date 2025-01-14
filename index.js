const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


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
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    response.send(
        `<div> Phonebook has info for ${phonebook.length} people` + 
        `<div> ${dateString} </div>`
    )
})

app.get('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    const number = phonebook.find(person => person.id === id)
    if (number) {
        response.json(number)
    } else {
        response.status(404).end()
    }
})

app.post('/api/phonebook', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const isAdded = phonebook.find(person => person.name === body.name || person.number === body.number)

    if (!isAdded) {
        const number = {
            id: generateId(),
            name: body.name,
            number: body.number,
        }

        phonebook = phonebook.concat(number)

        response.json(number)
    } else {
        response.status(400).json({
            error: 'name and number must be unique'
        })
    }
})

app.delete('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    const deletedPerson = {
        id: id,
        name: request.body.name,
        number: request.body.number
    }
    phonebook = phonebook.filter(number => number.id !== id)

    response.status(204).json({
        deletedPerson
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})