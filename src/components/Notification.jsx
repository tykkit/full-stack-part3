const Notification = ({ message, errorState }) => {
    const messageStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
      }
    if (!message) {
      return null
    }
  
    if (errorState) {
        const newStyle = {...messageStyle, color: 'red'}
        return (
            <div className="message" style={newStyle}>
              {message}
            </div>
          )
    }

    return (
      <div className="message" style={messageStyle}>
        {message}
      </div>
    )
  }

export default Notification