<script lang="ts">
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
</script>

<div class="weekdays-header">
    <!-- Шапка с днями недели -->

    {#each weekdays as weekday, idx (idx)}
        <span class="weekday" data-id={idx}>
            {weekday}
        </span>
    {/each}
</div>

<style lang="scss">
    div.weekdays-header {
        display: flex;
        flex-direction: row;

        & > span.weekday {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
