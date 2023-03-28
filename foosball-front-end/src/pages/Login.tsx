import { Link/* , useNavigate  */} from "react-router-dom";
import { registerRoute } from "./Register";
export const loginRoute:string = '/login';
export const Login = () => {
    /* const navigate = useNavigate();
    const navigateToRegister = () => {
        navigate(registerRoute);
    } */
    return (
        <div className="App">
            <h1>Welcome to the foosball tracking website!</h1>
            <form>
                <div className="login">
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <button type="submit" /* onClick={navigateToRegister} */>Login</button>
                </div>
            </form>
            <Link to={registerRoute}>Register</Link>
        </div>
    );
}