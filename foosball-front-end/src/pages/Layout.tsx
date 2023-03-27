import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link className='App-link' to="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link className='App-link' to="/blogs">Blogs</Link>
                    </li>
                    <li>
                        <Link className='App-link' to="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    );
};

export default Layout;