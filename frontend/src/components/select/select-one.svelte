<script>
    let { options, value, notChosenText, emptyDropdownText } = $props();
    let isDropdownOpen = $state(false);

    const handleOpenDropdown = () => {
        isDropdownOpen = true;
    };

    const handleCloseDropdown = () => {
        isDropdownOpen = false;
    };

    const handleChooseOption = (event) => {
        event.preventDefault();
        value = event.target.value;
        isDropdownOpen = false;
    };

    let selectedOption = options.find((o) => o.id === value);
</script>

<div class="select-wrapper" onfocus={handleOpenDropdown}>
    {#if selectedOption}
        <div class="selected-option">{selectedOption.label}</div>
    {:else}
        <div class="selected-option">{notChosenText}</div>
    {/if}

    {#if isDropdownOpen}
        <div class="dropdown-wrapper">
            {#each options as option, idx (idx)}
                <button type="button" class="option" value={option.id} onclick={handleChooseOption}>
                    {option.label}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    div.select-wrapper {}
</style>
