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
            <Route path=":roomId" element={<StandardPage/>}>
                <Route path="obs" elemtn={<DisplayOnly/>}/>
            </Route>
        </Route>
    </Routes>
);
    };

export default Pages;