import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {PlatformProvider} from "./PlatformContext"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RouteMap from "./RouteMap"
import "./index.css"
import Sidebar from "./Sidebar";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <PlatformProvider>
            <BrowserRouter>
                <Sidebar/>
                <Routes>
                    <Route path={"/"} element={<App/>}/>
                    <Route path={"/map"} element={<RouteMap/>}/>
                </Routes>
            </BrowserRouter>
        </PlatformProvider>
    </React.StrictMode>
);
