import {Link, Outlet, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import Alert from "./components/alert";

function App() {

    const [jwtToken, setJwtToken] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertClassName, setAlertClassName] = useState("d-none");

    const [tickInterval, setTickInterval] = useState(600000);

    const navigate = useNavigate();


    const toggleRefresh = useCallback((status) => {
        console.log("toggleRefresh clicked");

        if (status) {
            console.log("starting refresh");

            const requestOptions = {
                method: 'GET',
                credentials: 'include',

            };

            fetch('/refresh', requestOptions)
                .then((response) => response.json())
                .then(data => {
                    if (data.access_token) {
                        setJwtToken(data.access_token);
                        console.log("user logged in");
                    }
                })
                .catch((error) => {
                    console.log("user not logged in");
                })

            let interval = setInterval(() => {
                console.log("ticking every 10 minutes");

            }, 600000);

            if (tickInterval === 600000 ) {
                console.log("tickInterval is 600000");
            } else {
                setTickInterval(interval);

                console.log("tickInterval to", tickInterval);
            }


        } else {
            console.log("stopping refresh");
            setTickInterval(null)
            clearInterval(tickInterval);
        }
    }, [tickInterval]);

    useEffect(() => {
        if (jwtToken !== "") {
            const requestOptions = {
                method: 'GET',
                credentials: 'include',

            };

            fetch('/refresh', requestOptions)
                .then((response) => response.json())
                .then(data => {
                    if (data.access_token) {
                        setJwtToken(data.access_token);
                        console.log("user logged in");
                        toggleRefresh(true)
                    }
                })
                .catch((error) => {
                    console.log("user not logged in", error);
                })
        }
    }, [jwtToken, toggleRefresh]);

    const logOut = () => {
        const requestOptions = {
            method: 'GET',
            credentials: 'include',

        };

        fetch('/logout', requestOptions)
            .catch(
                (error) => {
                    console.log("logout failed", error);
                }
            )
            .finally(
                () => {
                    setJwtToken("");
                    toggleRefresh(false)
                }
            )

        setAlertClassName("alert-success");
        setAlertMessage("You have been logged out.");
        navigate("/login");
    };

    return (
        <div className="container">

            <div className="row">
                <div className="col-12">
                    <h1 className="mt-3">Go, watch a movie!</h1>
                </div>
                <div className="col-12 text-end">
                    {jwtToken === ""
                        ? <Link to="/login"><span className="badge bg-success">Login</span> </Link>
                        : <Link to="#!" onClick={logOut}><span className="badge bg-danger">Logout</span> </Link>}
                </div>
                <hr className="mb-3"/>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <nav>
                        <div className="list-group">
                            <Link to="/" className="list-group-item list-group-item-action">Home</Link>
                            <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
                            <Link to="/genres" className="list-group-item list-group-item-action">Genres</Link>
                            {jwtToken !== "" &&
                                <>
                                    <Link to="/admin/movie/0" className="list-group-item list-group-item-action">Add Movie</Link>
                                    <Link to="/manage-catalog" className="list-group-item list-group-item-action">Manage Catalog</Link>
                                    <Link to="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
                                </>
                            }
                        </div>
                    </nav>
                </div>
                <div className="col-md-10">
                    <Alert message={alertMessage} className={alertClassName}/>
                    <Outlet context={{
                        jwtToken: jwtToken,
                        setJwtToken: setJwtToken,
                        setAlertMessage: setAlertMessage,
                        setAlertClassName: setAlertClassName,
                        toggleRefresh: toggleRefresh
                    }}/>
                </div>
            </div>

        </div>
    );
}

export default App;
