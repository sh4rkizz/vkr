import StageList from './stage-list.svelte';
import { mount } from 'svelte';


const target = document.getElementById('stage-list-root');

if (target) {
    mount(StageList, { target, props: target.dataset });
}
