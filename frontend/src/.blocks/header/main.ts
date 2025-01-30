import Header from './header.svelte';
import { mount } from 'svelte';


const target = document.getElementById('header-root');

if (target) {
    mount(Header, { target, props: target.dataset });
}
