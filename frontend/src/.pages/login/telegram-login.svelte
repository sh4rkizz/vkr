import React from 'react';
import createScript from './script';
import { IScriptOptions } from './types';


type ITelegramAuthLogin = Pick<IScriptOptions, 'onAuthCallback'>;

declare global {
    interface Window {
        TelegramAuthLogin: ITelegramAuthLogin;
    }
}

function initTelegramAuthLogin(options: ITelegramAuthLogin) {
    window.TelegramAuthLogin = options;
}


const AuthButton = (props: IScriptOptions) => {
    const hiddenDivRef = React.useRef<HTMLDivElement>(null);
    const scriptRef = React.useRef<HTMLScriptElement>();

    React.useEffect(() => {
        scriptRef.current?.remove();
        initTelegramAuthLogin({ onAuthCallback: props.onAuthCallback });

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
