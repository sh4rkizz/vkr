<script>
    function generateCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        firstDayOfMonth = firstDay.getDay();

        const totalDaysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0,
        ).getDate();
        daysInMonth = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysInMonth.push(null);
        }

        // Добавляем все дни месяца
        for (let i = 1; i <= totalDaysInMonth; i++) {
            daysInMonth.push(i);
        }
    }
</script>
