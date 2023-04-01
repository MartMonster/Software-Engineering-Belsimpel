import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Layout }from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import { Login, loginRoute } from "./pages/Login";
import Page404 from "./pages/404";
import { WallOfFame1v1, wallOfFame1v1Route } from "./pages/WallOfFame1v1";
import { WallOfFame2v2, wallOfFame2v2Route } from "./pages/WallOfFame2v2";
import { AddGame1v1, addGame1v1Route } from './pages/AddGame1v1';
import { AddGame2v2, addGame2v2Route } from './pages/AddGame2v2';
import { LastGames1v1, lastGames1v1Route } from './pages/LastGames1v1';
import { LastGames2v2, lastGames2v2Route } from './pages/LastGames2v2';
import { CreateTeam, createTeamRoute } from './pages/CreateTeam';
import { Register, registerRoute } from './pages/Register';
import { OwnGames1v1, ownGames1v1Route } from './pages/OwnGames1v1';
import { OwnGames2v2, ownGames2v2Route } from './pages/OwnGames2v2';
import { OwnTeams, ownTeamsRoute } from './pages/OwnTeams';
import { EditGame1v1, editGame1v1Route } from './pages/EditGame1v1';
import { EditTeam, editTeamRoute } from './pages/EditTeam';
import { EditGame2v2, editGame2v2Route } from './pages/EditGame2v2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={loginRoute} element={<Login />} />
        <Route path={registerRoute} element={<Register />} />
        <Route path='/' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          
          <Route path={wallOfFame1v1Route} element={<WallOfFame1v1/>}/>
          <Route path={wallOfFame2v2Route} element={<WallOfFame2v2/>}/>
          <Route path={addGame1v1Route} element={<AddGame1v1/>}/>
          <Route path={addGame2v2Route} element={<AddGame2v2/>}/>
          <Route path={lastGames1v1Route}>
            <Route index element={<LastGames1v1/>}/>
            <Route path={ownGames1v1Route} element={<OwnGames1v1/>}/>
            <Route path={editGame1v1Route+'/:id'} element={<EditGame1v1/>}/>
          </Route>
          <Route path={lastGames2v2Route}>
            <Route index element={<LastGames2v2/>}/>
            <Route path={ownGames2v2Route} element={<OwnGames2v2/>}/>
            <Route path={editGame2v2Route+'/:id'} element={<EditGame2v2/>}/>
          </Route>
          <Route path={createTeamRoute} element={<CreateTeam/>}/>
          <Route path={ownTeamsRoute}>
            <Route index element={<OwnTeams />}/>
            <Route path={editTeamRoute+'/:id'} element={<EditTeam/>}/>
          </Route>
          <Route path="*" element={<Page404/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
