import Calendar from './calendar.svelte';
import { mount } from 'svelte';


const target = document.getElementById('calendar-root');

if (target) {
    mount(Calendar, { target, props: target.dataset });
}
