<script lang="ts">
    import createScript from './script';
    import { IScriptOptions } from './types';

    let scriptRef;
    let hiddenDivRef;
</script>


<div bind:this={hiddenDivRef} class="hidden-telegram-auth-button" hidden>

</div>



const AuthButton = (props: IScriptOptions) => {
    const hiddenDivRef = React.useRef<HTMLDivElement>(null);
    const scriptRef = React.useRef<HTMLScriptElement>();

    React.useEffect(() => {
        scriptRef.current?.remove();
        window.TelegramAuthLogin = { onAuthCallback: props.onAuthCallback };

        scriptRef.current = createScript(props);
        hiddenDivRef.current?.after(scriptRef.current);
        const siblings = hiddenDivRef.current?.parentElement?.children || [];

        return () => {
            scriptRef.current?.remove();

            for (const element of siblings) {
                if (element instanceof HTMLIFrameElement && element.src.includes('oauth.telegram.org')) {
                    element.remove();
                    break;
                }
            }
        };
    }, [props]);

    return <div ref={hiddenDivRef} hidden />;
}


export default AuthButton;
