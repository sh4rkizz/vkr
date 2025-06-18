import React from "react";
import { createRoot } from "react-dom/client";
import { LoginPage } from "./App";


const root = document.getElementById('page__login');
if (root) {
    const { user, userAccess } = root.dataset;
    createRoot(root).render(<LoginPage />);
} else {
    console.error('Not found <div id="page__login"></div>?');
}
