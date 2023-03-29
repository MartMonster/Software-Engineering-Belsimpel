import { Link, useNavigate } from "react-router-dom";
import { registerRoute } from "./Register";
export const loginRoute:string = '/login';
export const Login = () => {
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        navigate("/");
    }
    return (
        <div className="App">
            <h1>Welcome to the foosball tracking website!</h1>
            <form>
                <div className="login">
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <button type="submit" onClick={navigateToDashboard}>Login</button>
                </div>
            </form>
            <Link className="App-link" to={registerRoute}>Register</Link>
        </div>
    );
}