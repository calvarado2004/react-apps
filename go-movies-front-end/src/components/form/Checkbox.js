const Checkbox = (props) => {
    return (
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id={props.name} name={props.name} checked={props.checked} value={props.value} onChange={props.onChange}/>
            <label className="form-check-label" htmlFor={props.name}>{props.title}</label>
        </div>
    )
};

export default Checkbox;