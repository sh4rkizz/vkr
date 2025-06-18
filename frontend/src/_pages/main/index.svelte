<script>
    import { onMount } from "svelte";

    import Switch from "./Switch.svelte";

    import TutorMain from "./tutor-main.svelte";
    import StudentMain from "./student-main.svelte";

    import FaqBlock from "./FaqBlock.svelte";

    let { user, studentContext, tutorContext } = $props();

    const updateTabFromHash = () => {
        const hash = location.hash.replace("#", "");
        return ["student", "tutor"].includes(hash) ? hash : "student";
    };

    let currentTab = $state(updateTabFromHash());

    onMount(() => {
        const handleHash = () => {
            currentTab = updateTabFromHash();
        }

        window.addEventListener("hashchange", handleHash);
        return () => { window.removeEventListener("hashchange", handleHash) };
    });
</script>

<div class="page-wrapper main">
    <div class="content">
        <!-- <Switch {currentTab} /> -->

        {#if currentTab === "tutor"}
            <TutorMain context={tutorContext} />
        {:else}
            <StudentMain context={studentContext} />
            <FaqBlock context={tutorContext} />
        {/if}
    </div>

    <!-- <aside class="side-content">
        <div class="page-block">
            {user.email}
        </div>
    </aside> -->
</div>
