import type { IScriptOptions } from "./$types";


const createScript = (props: IScriptOptions): HTMLScriptElement => {
    const buttonSize = props.buttonSize || 'medium';
    const buttonLang = props.lang || 'en';
    const widgetVersion = props.widgetVersion || '21';

    const script = document.createElement('script');
    script.async = true;

    script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`;
    script.setAttribute('data-telegram-login', props.botUsername);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-userpic', JSON.stringify(Boolean(props.showAvatar)));
    script.setAttribute('data-lang', buttonLang);

    if (props.cornerRadius) {
        script.setAttribute('data-radius', `${props.cornerRadius}`);
    }

    if (props.requestAccess) {
        script.setAttribute('data-request-access', props.requestAccess);
    }

    if (props.authCallbackUrl) {
        script.setAttribute('data-auth-url', props.authCallbackUrl);
    } else if (props.onAuthCallback) {
        script.setAttribute('data-onauth', 'TelegramAuthLogin.onAuthCallback(user)');
    }

    return script;
}


export default createScript;
