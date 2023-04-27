import react, {useEffect} from "react";
import {Link} from "react-router-dom";

const Movies = () => {
    const [movies, setMovies] = react.useState([])

    useEffect(() => {

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow",

        };

        fetch(`${process.env.REACT_APP_BACKEND}/movies`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                setMovies(result);
            })
            .catch((error) => console.log("error", error));


    }, []);


    return (
        <>
            <div className="text-center">
                <h2>Movies</h2>
                <hr/>
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Release Date</th>
                        <th>Runtime</th>
                        <th>MPAA Rating</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>
                                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                            </td>
                            <td>{movie.release_date}</td>
                            <td>{movie.runtime}</td>
                            <td>{movie.mpaa_rating}</td>
                            <td>{movie.description}</td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Movies