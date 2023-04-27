import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Input from "./form/input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import Checkbox from "./form/Checkbox";
import Swal from "sweetalert2";

const EditMovie = () => {

    const navigate = useNavigate();
    const { jwtToken } = useOutletContext()
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const mpaaOptions = [
        {id: "G", value: "G"},
        {id: "PG", value: "PG"},
        {id: "PG-13", value: "PG-13"},
        {id: "R", value: "R"},
        {id: "NC17", value: "NC17"},
        {id: "18A", value: "18A"},
    ];

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [movie, setMovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: 0,
        mpaa_rating: "",
        description: "    ",
        genres : [],
        genres_array: [Array(13).fill(false)],
    });

    // get id from url
    let {id} = useParams();
    if (id === undefined) {
        id = 0;
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login")
            return;
        }

        if ( id === 0 ) {
            // adding a movie
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: 0,
                mpaa_rating: "",
                description: "    ",
                genres : [],
                genres_array: [Array(13).fill(false)],
            })

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const requestOptions = {
                method: 'GET',
                headers: headers,
            };

            fetch(`${process.env.REACT_APP_BACKEND}/genres`, requestOptions)
                .then((response) => response.json())
                .then(data => {
                    const checks = []

                    data.forEach(g => {
                        checks.push({id: g.id, checked: false, genre: g.genre});
                    })

                    setMovie(m => ({...m, genres: checks, genres_array: []}))

                })
                .catch((error) => {
                    console.log(error);
                })

        } else {
            // editing a movie
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `Bearer ${jwtToken}`)

            const requestOptions = {
                method: 'GET',
                headers: headers,
            };

            fetch(`${process.env.REACT_APP_BACKEND}/admin/movies/${id}`, requestOptions)
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        setError("Invalid response code:" + response.status);
                        return response.json();
                    }
                })
                .then((data) => {
                    // fix release date
                    data.movie.release_date = new Date(data.movie.release_date).toISOString().split("T")[0];
                    const checks = []

                    data.genres.forEach(g => {
                        if (data.movie.genres_array.indexOf(g.id) !== -1) {
                            checks.push({id: g.id, checked: true, genre: g.genre});
                        } else {
                            checks.push({id: g.id, checked: false, genre: g.genre});
                        }
                    })
                    // set state
                    setMovie({
                        ...data.movie, genres: checks})
                })
                .catch((error) => {
                    console.log(error);
                })

        }

    }, [id, jwtToken, navigate]);


    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];

        let requiredFields = [
            {field: movie.title, name: "title"},
            {field: movie.release_date, name: "release_date"},
            {field: movie.runtime, name: "runtime"},
            {field: movie.description, name: "description"},
            {field: movie.mpaa_rating, name: "mpaa_rating"},

        ];

        requiredFields.forEach(f => {
            if (f.field === "") {
                errors.push(f.name);
            }
        })

        if (movie.genres_array.length === 0) {
           Swal.fire({
                title: "Error",
                text: "You must select at least one genre",
                icon: "error",
                confirmButtonText: "OK",
           })
           errors.push("genres");
        }

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        // passed validation, save changes

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${jwtToken}`)

        let methodvar = "PUT";
        if (movie.id > 0) {
            methodvar = "PATCH";
        }

        const requestBody = movie;

        requestBody.release_date = new Date (movie.release_date)
        requestBody.runtime = parseInt(movie.runtime, 10);


        const requestOptions = {
            method: methodvar,
            headers: headers,
            body: JSON.stringify(requestBody),
            credentials: 'include',
        }

        fetch(`${process.env.REACT_APP_BACKEND}/admin/movies/${movie.id}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Something went wrong");
                }})
            .then(data => {
                   if (data.error) {
                       console.log("error", data.error)
                   } else {
                       navigate("/manage-catalog")
                   }
            })
            .catch((error) => {
                console.log(error);
            })


    }

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setMovie({...movie, [name]: value})
    };


    const handleCheck = (event, position) => {
        console.log("handle check called")
        console.log("value in handle check", event.target.value)
        console.log("is it checked", event.target.checked)
        console.log("position", position)

        let tmpArr = movie.genres;

        tmpArr[position].checked = !tmpArr[position].checked;

        let tmpIDs = movie.genres_array;

        if (!event.target.checked) {
            tmpIDs.splice(tmpIDs.indexOf(event.target.value) );
        } else {
            tmpIDs.push(parseInt(event.target.value, 10));
        }

        setMovie({...movie, genres_array: tmpIDs})

    }

    const confirmDelete = () => {
        Swal.fire({
            title: "Delete Movie?",
            text: "You won't be able to undo this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.isConfirmed) {

                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Authorization', `Bearer ${jwtToken}`)
                let requestOptions = {
                    method: 'DELETE',
                    headers: headers,
                }

                fetch(`${process.env.REACT_APP_BACKEND}/admin/movies/${movie.id}`, requestOptions)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Something went wrong");
                        }})
                    .then(data => {
                        if (data.error) {
                            console.log("error", data.error)
                        } else {
                            navigate("/manage-catalog")
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        })
    }

    if (error !== null ) {

        return (
            <div>
                <h2>Error: {error}</h2>
            </div>
        );

    } else {

        return (
            <>
                <div className="text-center">
                    <h2>Add/Edit Movie</h2>
                    <hr/>

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

                        <Input
                            title={"Runtime"}
                            className={"form-control"}
                            type={"text"}
                            name={"runtime"}
                            value={movie.runtime}
                            onChange={handleChange("runtime")}
                            errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a runtime"}
                        />

                        <Select
                            title={"MPAA Rating"}
                            name={"mpaa_rating"}
                            options={mpaaOptions}
                            onChange={handleChange("mpaa_rating")}
                            placeholder={"Choose..."}
                            value={movie.mpaa_rating}
                            errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                            errorMsg={"Please select a rating"}
                        />

                        <TextArea
                            title={"Description"}
                            name={"description"}
                            value={movie.description}
                            onChange={handleChange("description")}
                            rows={3}
                            cols={80}
                            errorDiv={hasError("description") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a description"}
                        />

                        <hr/>

                        <h3>Genres</h3>

                        {movie.genres && movie.genres.length > 0 &&
                            <>
                                {Array.from(movie.genres).map((g, index) => (
                                    <Checkbox
                                        title={g.genre}
                                        name={"genre"}
                                        key={index}
                                        id={"genre-" + g.id}
                                        onChange={(event) => handleCheck(event, index)}
                                        value={g.id}
                                        checked={movie.genres[index].checked}
                                    />

                                ))}
                            </>

                        }

                        <hr/>

                        <button className="btn btn-primary">Save</button>

                        {movie.id > 0 &&
                            (<a href="#!" className="btn btn-danger ms-2" onClick={confirmDelete} >Delete Movie</a>)
                        }

                    </form>
                </div>
            </>
        )
    }
}

export default EditMovie