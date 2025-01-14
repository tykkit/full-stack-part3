const PersonForm = ({nameValue, numberValue, nameHandler, numberHandler, submitFunc}) => {
    return(
        <div>
            <form onSubmit={submitFunc}>
                <div>
                name: <input 
                    value={nameValue}
                    onChange={nameHandler}
                />
                </div>
                <div>
                number: <input 
                    value={numberValue}
                    onChange={numberHandler}
                />
                </div>
                <div>
                <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default PersonForm