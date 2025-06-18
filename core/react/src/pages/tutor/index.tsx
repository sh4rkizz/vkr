import React from "react";
import { createRoot } from "react-dom/client";
import { TutorPage } from "./App";


const root = document.getElementById('page__tutor');
if (root) {
    const { user, userAccess } = root.dataset;
    createRoot(root).render(<TutorPage />);
} else {
    console.error('Not found <div id="page__tutor"></div>?');
}
