<script>
    let { currentTab } = $props();
</script>

<div class="switch">
    <a href="#student" class:is_active={currentTab === "student"}>
        Я &mdash; студент
    </a>

    <a href="#tutor" class:is_active={currentTab === "tutor"}>
        Я &mdash; препод
    </a>
</div>

<style lang="scss">
    .switch {
        margin-bottom: -16px;
        gap: 8px;
        display: flex;
        flex-direction: row;

        a {
            font-size: 22px;
            line-height: 26px;
            padding: 8px;
            border-radius: 4px;

            &.is_active {
                color: black;
            }
        }
    }

    @media screen and (width < 1024px) {
        .switch {
            gap: 4px;
            margin-bottom: -8px;
        }

        .switch > a {
            font-size: 18px;
            line-height: 22px;
        }
    }

    @media screen and (width < 768px) {
        .switch > a {
            font-size: 16px;
            line-height: 22px;
        }
    }
</style>
