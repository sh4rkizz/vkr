<script lang="ts">
    import FileUploadForm from "$components/file-upload/index.svelte";

    const { context } = $props();

    const applyWork = (event: MouseEvent) => {
        console.log(event);
        // TODO open modal
    };

    const openHelp = (event: MouseEvent) => {
        console.log(event);
    };
</script>

<div class="page-block tutor">
    <div class="work-application__wrapper">
        <div class="work-application__content">
            <div class="heading">
                <h4 class="title">Сдача ВКР</h4>
                <span class="dates">До 23 апреля</span>
            </div>

            <FileUploadForm stepId={1} />

            <p>
                LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem
                ipsum dolor sit amet consectetur adipisicing elit. Totam
                assumenda perspiciatis illum fugit impedit illo quasi ipsa omnis
                adipisci, quidem molestias aliquid, molestiae consectetur,
                labore praesentium est dignissimos maiores provident!
            </p>
        </div>

        <div class="work-application__button-wrapper">
            <button class="primary" onclick={applyWork}>Сдать работу</button>
            <button class="secondary" onclick={openHelp}>Требования</button>
        </div>
    </div>
</div>

<style lang="scss">
    .work-application {
        &__wrapper {
            display: flex;
            flex-direction: column;
        }

        &__content {
            .heading {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
                gap: 12px;

                .title {
                    line-clamp: 2;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    display: -webkit-box;
                }

                .dates {
                    color: #6d7885;
                }
            }

            word-break: break-word;
        }

        &__button-wrapper {
            margin-top: 12px;
            display: flex;
            flex-direction: row;
            gap: 8px;
        }
    }
</style>
