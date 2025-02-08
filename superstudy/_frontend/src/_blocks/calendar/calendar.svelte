<script lang="ts">
    import { onMount } from "svelte";
    
    import NotificationsLoader from "../notifications/notifications-loader.svelte";

    let { userId } = $props();

    let calendarIsLoading = $state(false);
    let calendarPregetchIsLoading = $state(false);

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const fetchCalendarData = () => {
        return fetch("/api/calendar");
    };

    onMount(async () => {
        try {
            calendarIsLoading = true;
            const result = await fetchCalendarData();
            console.log(result);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                calendarIsLoading = false;
            }, 500);
        }
    });
</script>

<div class="calendar-wrapper">
    {#if calendarIsLoading}
        <NotificationsLoader />
    {:else}
        {userId}
    {/if}

    <!-- {#each calendarItems as item, idx (idx)}
        <div class="calendar-item" item-id={item.id}>
            {item.day}
        </div>
    {/each} -->
</div>

<style lang="scss">
    div.calendar-wrapper {
        /* display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(6, fit-content);
        gap: 4px;

        & > div.calendar-item {
            color: green;
        }

        & > :nth-child(7n) {
            color: red;
        } */
    }
</style>
