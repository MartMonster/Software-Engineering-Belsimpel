import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const PasswordReset = () => {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(params.hash)
    console.log(searchParams.get("email"))
    return (
        <div className="App-header">
            <div className='App'>
                <h1>404 - Page Not Found</h1>
            </div>
        </div>
    );
}

export default PasswordReset;