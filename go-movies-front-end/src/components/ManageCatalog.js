import react, {useEffect} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";

const ManageCatalog = () => {
    const [movies, setMovies] = react.useState([])
    const {jwtToken} = useOutletContext();

    const navigate = useNavigate()

    useEffect(() => {

        if (jwtToken === "") {
            navigate("/login");
        }

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow",

        };

        fetch(`http://localhost:8080/admin/movies`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                setMovies(result);
            })
            .catch((error) => console.log("error", error));


    }, [jwtToken, navigate])


    return (
        <>
            <div className="text-center">
                <h2>Manage Catalog (authenticated)</h2>
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
                                <Link to={`/admin/movie/${movie.id}`}>{movie.title}</Link>
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

export default ManageCatalog