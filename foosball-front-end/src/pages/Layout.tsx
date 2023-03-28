import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div className="App-header">
            <nav>
                <ul>
                    <li>
                        <Link className='App-link' to="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link className='App-link' to="/login">Login</Link>
                    </li>
                    <li>
                        <Link className='App-link' to="/default">Default</Link>
                    </li>
                    {/* <li>
                        <Link className='App-link' to="/blogs">Blogs</Link>
                    </li>
                    <li>
                        <Link className='App-link' to="/contact">Contact</Link>
                    </li> */}
                </ul>
            </nav>
            <hr/>
            <Outlet />
        </div>
    );
};

export default Layout;