<script>
    const { faqItems = [] } = $props();
</script>

{#if faqItems?.length}
    <div class="page-block tutor">
        <h3>FAQ</h3>

        {#each faqItems as faqItem, idx (idx)}
            <div class="faq-item" data-faq-id={faqItem.id}>
                <div class="question">{faqItem.question}</div>
                <div class="answer">{faqItem.answer}</div>
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
    .faq-item {
        padding: 16px;
        border-radius: 8px;
        box-shadow:
            rgba(0, 119, 255, 0.2) 0px 0px 2px,
            rgba(0, 119, 255, 0.12) 0px 6px 20px 8px;

        .question {
        }
        .answer {
        }
    }
</style>
