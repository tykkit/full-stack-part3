const Persons = ({ persons, onButtonPress}) => {
    return (
        <div>
            {persons.map(person => 
                <div>
                    {person.name} {person.number} <button onClick={() => onButtonPress(person)}>delete</button>
                </div>
            )}
        </div>
    )
}

export default Persons