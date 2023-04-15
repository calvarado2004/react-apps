import {useState} from "react";
import Input from "./form/input";
import {useOutletContext} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {setJwtToken} = useOutletContext();
    const {setAlertMessage} = useOutletContext();
    const {setAlertClassName} = useOutletContext();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email === "admin@example.com") {
            console.log("email: " + email, "password: " + password);

            setJwtToken("abc");
            setAlertClassName("d-none");
            setAlertMessage("");
        } else {
            setAlertClassName("alert alert-danger");
            setAlertMessage("Invalid email or password.");
        }
    }


    return (

            <div className="col-md-6 offset-md-3">
                <h2>Login</h2>
                <hr/>
                <form onSubmit={handleSubmit}>
                    <Input
                        title="Email"
                        type="email"
                        className="form-control"
                        name="email"
                        autoComplete="email-new"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Input
                        title="Password"
                        type="password"
                        className="form-control"
                        name="password"
                        autoComplete="password-new"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <hr/>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        value="login"
                    >
                        Login
                    </button>
                </form>
            </div>
    )
}

export default Login;