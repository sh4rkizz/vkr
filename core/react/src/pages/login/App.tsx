import React, { useState } from 'react';
import { css, styled } from 'styled-components';
import { TelegramLoginButton } from './telegram-button';


const SWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SAuthCard = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;

    flex-direction: column;
    background-color: #FFF;

    padding: 24px 16px 16px 16px;
    border-radius: 12px;
    width: 480px;
    height: 600px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const SPageTitle = styled.span`
    font-weight: 600;
    font-size: 26px;
    line-height: 30px;
`;

const SPageSwitchWrapper = styled.div`
    width: 100%;

    display: flex;
    gap: 2px;
    align-items: center;
    flex-direction: row;

    padding: 2px;
    border-radius: 10px;
    background-color: #F5F5F5;
`;

const SPageSwitch = styled.div<{ $active: boolean }>`
    box-sizing: border-box;

    flex: 1;
    border-radius: 8px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    height: 32px;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;

    border: 0.5px solid transparent;
    transition: background-color 0.2s ease-out;

    ${({ $active }) => $active && css`
        background-color: #FFF;
        box-shadow:
            0px 4px 8px 0px rgba(0, 0, 0, 0.08),
            0px 0px 4px 0px rgba(0, 0, 0, 0.08);
        border: 0.5px solid rgba(0, 0, 0, 0.08);
    `}
`;

const SOAuthWrapper = styled.div`
`;


export const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет логика авторизации/регистрации
    };

    const handleSocialAuth = (provider: string) => {
        // Редирект на OAuth провайдера
    };

    return (
        <SWrapper>
            <SAuthCard>
                {isLogin
                    ? <SPageTitle>Вход</SPageTitle>
                    : <SPageTitle>Регистрация</SPageTitle>}

                <SPageSwitchWrapper>
                    <SPageSwitch $active={isLogin} onClick={() => setIsLogin(true)}>Вход</SPageSwitch>
                    <SPageSwitch $active={!isLogin} onClick={() => setIsLogin(false)}>Регистрация</SPageSwitch>
                </SPageSwitchWrapper>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>

                    {isLogin
                        ? <button type="submit">Войти</button>
                        : <button type="submit">Зарегистрироваться</button>}
                </form>

                <SOAuthWrapper>
                    <p>Или войти через:</p>
                    <TelegramLoginButton />
                    {/* <button onClick={() => handleSocialAuth('telegram')}>Telegram</button> */}
                    <button onClick={() => handleSocialAuth('vk')}>VK</button>
                </SOAuthWrapper>
            </SAuthCard>
        </SWrapper>
    );
};