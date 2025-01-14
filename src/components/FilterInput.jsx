const Filter = ({text, handler}) => {
    return (
    <div>
        filter shown numbers with <input 
          value={text}
          onChange={handler}
        />
    </div>
)}

export default Filter