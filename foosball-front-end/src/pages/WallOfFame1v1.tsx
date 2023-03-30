import React, { useState, useEffect } from 'react';
import { getTop10Users, User } from '../components/axios';

export const wallOfFame1v1Route:string = "WallOfFame1v1"
export const WallOfFame1v1 = () => {
    const [users, setUsers] = useState(new Array<User>());
    useEffect(() => {
        getTop10Users().then((data) => {
            if (data !== undefined) {
                setUsers(data);
                console.log(data);
            }
        });
    }, []);
    return (
        <div className="App">
            <h1>Wall of fame 1v1</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Elo</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user: User, index) => {
                        return (
                            <tr>
                                <td key={user.id}>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.elo}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
