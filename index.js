const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})