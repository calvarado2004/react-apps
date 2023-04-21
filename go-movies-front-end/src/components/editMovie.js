import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Input from "./form/input";

const EditMovie = () => {

    const navigate = useNavigate();
    const { jwtToken } = useOutletContext()
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [movie, setMovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: 0,
        mpaa_rating: "",
        description: "",
    });

    // get id from url
    let {id} = useParams();

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login")
            return;
        }
    }, [jwtToken, navigate]);


    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setMovie({...movie, [name]: value})
    };


    return (
        <>
            <div className="text-center">
                <h2>Add/Edit Movie</h2>
                <hr/>
                <pre>{JSON.stringify(movie, null, 3)}</pre>

                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={movie.id} id="id"/>
                    <Input
                        title={"Title"}
                        className={"form-control"}
                        type={"text"}
                        name={"title"}
                        value={movie.title}
                        onChange={handleChange("title")}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input
                        title={"Release Date"}
                        className={"form-control"}
                        type={"date"}
                        name={"release_date"}
                        value={movie.release_date}
                        onChange={handleChange("release_date")}
                        errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a release date"}
                    />

                </form>
            </div>
        </>
    )
}

export default EditMovie