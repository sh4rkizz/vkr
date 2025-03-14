interface ILoginProps {
    username: string;
    password: string;
}

interface ILoginErrorProps {
    username?: string[];
    password?: string[];

    __all__?: string[];
    ratelimit?: string[];
    non_field_errors?: string[];
}

interface ITelegramUserProps {
    id: string;         // уникальный идентификатор пользователя в Telegram
    first_name: string; // имя из профиля пользователя
    last_name: string;  // фамилия из профиля пользователя
    username: string;   // уникальное имя из профиля
    photo_url: string;  // ссылка на аватарку пользователя в виде https://t.me/i/.../user.jpg
    auth_date: string;  // дата авторазации
    hash: string;       // HMAC - подпись ответа на основе секретного токена бота
}

interface IScriptOptions {
    botUsername: string;
    authCallbackUrl?: string;
    buttonSize?: 'large' | 'medium' | 'small';
    cornerRadius?: number;
    lang?: string;
    onAuthCallback?: (data: ITelegramUserProps) => void;
    requestAccess?: 'write' | null;
    showAvatar?: boolean;
    widgetVersion?: number | string;
}

type ITelegramAuthLogin = Pick<IScriptOptions, 'onAuthCallback'>;

declare global {
    interface Window {
        TelegramAuthLogin: ITelegramAuthLogin;
    }
}


export type { ILoginProps, ILoginErrorProps, ITelegramUserProps, IScriptOptions };
