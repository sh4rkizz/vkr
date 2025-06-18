import React from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "./App";


const root = document.getElementById('page__main');
if (root) {
    const { user, userAccess } = root.dataset;
    createRoot(root).render(<MainPage />);
} else {
    console.error('Not found <div id="page__main"></div>?');
}
