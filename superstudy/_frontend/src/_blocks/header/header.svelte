<script>
    import Logo from "./logo.svelte";
    let { userId, isStaff } = $props();
</script>

<header>
    <div class="header-content">
        <a href="/">
            <Logo />
        </a>

        <nav class="menu">
            <ul>
                <li><a href="/">Главная</a></li>

                {#if isStaff}
                    <li><a href="/management/">Управление</a></li>
                {:else}
                    <li><a href="/study/">Мое обучение</a></li>
                {/if}
            </ul>
        </nav>

        <div class="profile-wrapper">
            {userId}
        </div>
    </div>
</header>

<style lang="scss">
    header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    div.header-content {
        flex: 1;
        gap: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        box-sizing: border-box;
        padding: 10px 24px;
        width: var(--width-desktopXL);

        nav.menu > ul {
            a {
                border-radius: 4px;
                padding: 8px;
            }

            padding: 8px 16px 8px 16px;
            display: flex;
            flex-direction: row;
            gap: 8px;
        }

        div.profile-wrapper {
            margin-left: auto;
        }
    }

    @media screen and (width < 1024px) {
        nav.menu {
            display: none;
        }
    }
</style>
