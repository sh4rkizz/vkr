import App from './App.svelte';
import { mount } from 'svelte';


const target = document.getElementById('stage-root');

if (target) {
    mount(App, { target, props: target.dataset });
}
