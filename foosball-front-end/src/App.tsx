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
import { ListOfTeams, listOfTeamsRoute } from './pages/ListOfTeams';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path={loginRoute} element={<Login/>}/>
          <Route path={wallOfFame1v1Route} element={<WallOfFame1v1/>}/>
          <Route path={wallOfFame2v2Route} element={<WallOfFame2v2/>}/>
          <Route path={addGame1v1Route} element={<AddGame1v1/>}/>
          <Route path={addGame2v2Route} element={<AddGame2v2/>}/>
          <Route path={lastGames1v1Route} element={<LastGames1v1/>}/>
          <Route path={lastGames2v2Route} element={<LastGames2v2/>}/>
          <Route path={createTeamRoute} element={<CreateTeam/>}/>
          <Route path={listOfTeamsRoute} element={<ListOfTeams/>}/>
          <Route path="*" element={<Page404/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
