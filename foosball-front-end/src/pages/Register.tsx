export const registerRoute: string = '/register';
export const Register = () => {
    return (
        <div className="App">
            <h1>Welcome to the foosball tracking website!</h1>
            <form>
                <div className="login">
                    <input type="email" placeholder="Email" />
                    <input type="text" placeholder="Username" />
                    <input type="text" placeholder="First name" />
                    <input type="text" placeholder="Last name" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}