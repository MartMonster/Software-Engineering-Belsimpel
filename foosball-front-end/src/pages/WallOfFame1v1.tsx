import React, { useState, useEffect, useCallback } from 'react';
import { getTop10Users, User } from '../components/axios';

export const wallOfFame1v1Route:string = "WallOfFame1v1"
export const WallOfFame1v1 = () => {
    const [users, setUsers] = useState(new Array<User>());
    const [errorMessage, setErrorMessage] = useState("")
    const error = useCallback(() => {
        if (errorMessage !== "") {
            return <p className='errorMessage'>{errorMessage.toString()}</p>
        }
    }, [errorMessage])
    useEffect(() => {
        getTop10Users(setErrorMessage).then((data) => {
            setUsers(data);
            console.log(data);
        });
    }, []);
    return (
        <div className="App">
            <h1>Wall of fame 1v1</h1>
            {error()}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: User, index) => {
                        return (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td className='WoF1v1'>{user.username}</td>
                                <td>{Math.round(user.elo)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
