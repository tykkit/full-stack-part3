const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@fullstack3c.y49el.mongodb.net/numberApp?retryWrites=true&w=majority&appName=Fullstack3c`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Number = mongoose.model('Number', numberSchema)

if (!process.argv[3] || !process.argv[4]) {
    console.log('phonebook:')
    Number.find({}).then(result => {
        result.forEach(number => {
            console.log(`${number.name} ${number.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4],
    })

    number.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook!`)
        mongoose.connection.close()
    })
}