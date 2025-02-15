import Header from '$blocks/header/index.svelte';
import { mount } from 'svelte';


const target = document.getElementById('header-root');

if (target) {
    const { user = "" } = target.dataset;
    mount(Header, { target, props: { user: JSON.parse(user) } });
}
