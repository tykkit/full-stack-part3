import { useState, useEffect } from 'react'
import Persons from './components/PhonebookNumber'
import Filter from './components/FilterInput'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => console.log(error))
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const hasElement = persons.find(element => element.name === newName)
    console.log(hasElement)
    if (!hasElement) {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))            
          setNewName('')
          setNewNumber('')
        })
        .catch(error => { 
          console.log(error)
        })
      setMessage(`Added ${personObject.name}`)        
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } else {
      updateNumber(personObject.name) 
    }
  }

  const removePerson = (person) => {
    console.log(person)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.filter(p => p.id !== person.id))
        }
        )
        .catch(error => {
          console.log(error)
        })
      setMessage(`Deleted ${person.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      }
  }

  const updateNumber = (name) => {
    if (window.confirm(`${name} is already added to the phonebook, replace the old number with a new one?`)) {
      const person = persons.find(e => e.name === name)
      const updatedPerson = {...person, number: newNumber}
      personService
        .update(person.id, updatedPerson)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.map(n => {
            if (n.id === person.id) {
              return updatedPerson
            } else {
              return n
            }
          }))
          setMessage(`Updated ${name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(e => {
          console.log(e)
          setMessage(`Information of ${person.name} has already been removed from server`)
          setIsError(true)
          setTimeout(() => {
            setMessage(null)
            setIsError(false)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
    } else {
      setNewName('')
      setNewNumber('')
    }
  }

  const handlePersonAdd = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const personsToShow = filter !== ''
    ? persons.filter(person => person.name.toLowerCase().includes(filter))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} errorState={isError} />

      <Filter text={filter} handler={handleFilterChange} />
      
      <h3>Add new number</h3>
      
      <PersonForm 
        nameValue={newName} 
        numberValue={newNumber}
        nameHandler={handlePersonAdd}
        numberHandler={handleNumber}
        submitFunc={addPerson}
      />  

      <h3>Numbers</h3>
      
      <Persons persons={personsToShow} onButtonPress={removePerson}/>

    </div>
  )

}

export default App