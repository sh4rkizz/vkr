<script lang="ts">
    import Logo from "./logo.svelte";
    let { user } = $props();

    const headerLinks = [
        {
            href: "/",
            title: "Главная",
            isVisible: true,
        },
        // {
        //     href: "/study/",
        //     title: "Обучение",
        //     isVisible: true,
        // },
        // {
        //     href: "/study/",
        //     title: "Оценка",
        //     isVisible: true,
        // },
        {
            href: "/management/",
            title: "Управление",
            isVisible: true,
        },
    ].filter((l) => l.isVisible);
</script>

<header>
    <div class="header-content">
        <a href="/" aria-label="Переход на главную">
            <Logo />
        </a>

        <nav class="menu">
            <ul>
                {#each headerLinks as { href, title }, idx (idx)}
                    <li>
                        <a {href} aria-label={`Переход к странице ${title}`}>
                            {title}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>

        <div class="profile-wrapper">
            <a href="/profile/">{user.email}</a>
        </div>

        <div class="mobile-menu-wrapper">
            <button
                aria-label="Открыть мобильное меню"
                onclick={() => console.log("opening mobile slider")}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M21 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11ZM21 4H3C2.44772 4 2 4.44772 2 5C2 5.55228 2.44772 6 3 6H21C21.5523 6 22 5.55228 22 5C22 4.44772 21.5523 4 21 4ZM3 20H21C21.5523 20 22 19.5523 22 19C22 18.4477 21.5523 18 21 18H3C2.44772 18 2 18.4477 2 19C2 19.5523 2.44772 20 3 20Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
        </div>
    </div>
</header>

<style lang="scss">
    header {
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        position: fixed;

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);

        top: 0;
        left: 0;
        right: 0;

        box-shadow: 0 2px 6px -2px #cacaca;
    }

    div.header-content {
        flex: 1;
        gap: 8px;
        display: flex;
        align-items: center;

        box-sizing: border-box;
        padding: 10px 24px;
        max-width: 1440px;

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
            a {
                border-radius: 4px;
            }

            margin-left: auto;
        }

        div.mobile-menu-wrapper {
            margin-left: auto;
        }
    }

    @media screen and (width < 1024px) {
        nav.menu,
        div.profile-wrapper {
            display: none;
        }

        div.header-content {
            padding: 10px 12px;
        }
    }

    @media screen and (width >= 1024px) {
        div.mobile-menu-wrapper {
            display: none;
        }
    }
</style>
