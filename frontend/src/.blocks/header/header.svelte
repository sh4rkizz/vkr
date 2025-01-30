<script>
    let { userId } = $props();
</script>

<header>
    <div class="header-content">
        {userId}
    </div>
</header>

<style>
    header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    div.header-content {
        display: flex;
        align-items: center;
        justify-content: center;

        box-sizing: border-box;
        padding: 10px 24px;
        width: var(--width-desktopXL);
    }
</style>
