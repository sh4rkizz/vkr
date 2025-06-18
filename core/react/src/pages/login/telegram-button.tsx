import React, { useEffect } from 'react';


export const TelegramLoginButton = ({
    botName = "kralocalhostbot",
    buttonSize = "large",
    cornerRadius = 8,
    requestAccess = "write",
    onAuthCallback = (user) => console.log(user),
    className = ""
}) => {
    useEffect(() => {
        // Load the Telegram script dynamically
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', buttonSize);
        script.setAttribute('data-radius', cornerRadius);
        script.setAttribute('data-request-access', requestAccess);
        script.setAttribute('data-onauth', 'onTelegramAuth');

        // Create global callback function
        window.onTelegramAuth = (user) => {
            onAuthCallback(user);
        };

        // Add to document
        const container = document.getElementById('telegram-login-container');
        container.appendChild(script);

        return () => {
            // Cleanup
            if (window.onTelegramAuth) {
                delete window.onTelegramAuth;
            }
            if (container.contains(script)) {
                container.removeChild(script);
            }
        };
    }, [botName, buttonSize, cornerRadius, requestAccess, onAuthCallback]);

    return (
        <div
            id="telegram-login-container"
            className={`telegram-login-button-wrapper ${className}`}
        >
            {/* This div will be replaced by Telegram's button */}
        </div>
    );
};
