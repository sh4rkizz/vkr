<script lang="ts">
    let { currentYear, currentMonth } = $props();

    const prevMonth = () => {
        if (currentMonth > 0) {
            currentMonth--;
        } else {
            currentMonth = 11;
            currentYear--;
        }
    };

    const nextMonth = () => {
        if (currentMonth < 11) {
            currentMonth++;
        } else {
            currentMonth = 0;
            currentYear++;
        }
    };
</script>

<div class="months-header">
    <!-- Навигация по месяцам -->
    <button type="button" onclick={prevMonth}>&lt;</button>
    <span>{currentYear} - {currentMonth + 1}</span>
    <button type="button" onclick={nextMonth}>&gt;</button>
</div>

<style lang="scss">
    div.months-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>
