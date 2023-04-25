import {Link, useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

const OneGenre = ({ genre }) => {

    // we need to get the prop passed in from the parent component
    const location = useLocation();
    const {genreName} = location.state;

    // set stateful values for the component
    const [movies, setMovies] = useState([]);

    // get the id from the url

    let {id} = useParams();

    // useEffect to get the genre from the server
    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const requestOptions = {
            method: 'GET',
            headers: headers,
        }

        fetch(`/movies/genres/${id}`, requestOptions)
            .then((response) => response.json())
            .then(data => {
                if (data.error) {
                    console.log(data.message)
                } else {
                    setMovies(data);
                }
            })
            .catch((error) => {
                console.log(error);
            })

    }, [id]);

    // return the JSX that should be rendered
    return (
    <>
        <h2>Genre: {genreName}</h2>
        <hr/>
        {movies ? (
            <table className={"table table-striped table-hover"}>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Release Date</th>
                    <th>Rating</th>
                </tr>
                </thead>
                <tbody>
                {movies.map((movie) => (
                    <tr key={movie.id}>
                        <td>
                            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                        </td>
                        <td>{movie.release_date}</td>
                        <td>{movie.mpaa_rating}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : (
            <p>There are no movies in this genre.</p>
        )}

    </>
    )
};

export default OneGenre;