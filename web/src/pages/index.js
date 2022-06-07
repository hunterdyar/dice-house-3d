import React from "react";

import { Routes, Route, Outlet } from "react-router-dom";

import Landing from "./landing";
import DisplayOnly from "./displayOnly";
import StandardPage from "./standardPage";

function Layout () {
    return (
        <div>
            <main>
                <Outlet/>
            </main>
        </div>
    );
};

function Pages() {
    return (
    <Routes>
        <Route path="/" element={<Layout/>}>
            <Route index element={<Landing/>}/>
            <Route path=":roomId">
                <Route index element={<StandardPage/>}/>
                <Route path="obs" element={<DisplayOnly/>}/>
            </Route>
        </Route>
    </Routes>
);
    };

export default Pages;