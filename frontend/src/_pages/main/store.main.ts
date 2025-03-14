export function createMainStore() {
    let pageSwitch = $state("student");

    const handlePageSwitch = (newPage: string) => {
        pageSwitch = ["student", "tutor"].includes(newPage) ? newPage : "student";
    }

    return {
        get pageSwitch() { return pageSwitch },
        switchPage: handlePageSwitch
    };
}
