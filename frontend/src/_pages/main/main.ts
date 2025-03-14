import MainPage from './index.svelte';
import { mount } from 'svelte';

const target = document.getElementById('page-root-main');

if (target) {
    const { user = "", studentContext = "", tutorContext = "" } = target.dataset;

    const props = {
        user: JSON.parse(user),
        studentContext: JSON.parse(studentContext),
        tutorContext: JSON.parse(tutorContext),
    }

    mount(MainPage, { target, props });
}
