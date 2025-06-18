import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from './calendar';
import WorkStages from './work-stages';


const SAppWrapper = styled.div`
    display: flex;
    padding: 16px 24px;
    gap: 16px;
    box-sizing: border-box;
`;


const SMain = styled.main`
    box-sizing: border-box;
    width: 100%;
`;

const SAside = styled.aside`
    box-sizing: border-box;
    max-width: 300px;
    min-width: 300px;
`;

export const MainPage = () => {
    const stages = [
        {
            id: 1,
            title: 'Анализ требований',
            description: 'Сбор и анализ требований к работе',
            date: '2025-03-01T23:59',
            status: 'approved',
            review: {
                grade: 95,
                comment: 'Отличная работа, все требования учтены',
                attachments: [
                    { name: 'Комментарии.pdf', url: '/files/comments1.pdf' }
                ]
            },
            solution: {
                comment: "Передаю работу на проверку",
                attachments: [
                    { name: 'Анализ требований.pdf', url: '/files/comments1.pdf' }
                ]
            }
        },
        {
            id: 2,
            title: 'Проектирование',
            description: 'Создание технического проекта',
            date: '2025-03-31T23:59',
            status: 'approved',
            review: {
                grade: 87,
                comment: 'Хороший проект, но есть замечания по архитектуре',
                attachments: [
                    { name: 'Замечания.docx', url: '/files/comments2.docx' }
                ]
            },
            solution: {
                comment: "Передаю работу на проверку",
                attachments: [
                    { name: 'Проектирование.docx', url: '/files/comments2.docx' },
                    { name: 'IDEFO.png', url: '/files/comments2.docx' },
                    { name: 'DFD.png', url: '/files/comments2.docx' },
                ]
            }
        },
        {
            id: 3,
            title: 'Разработка',
            description: 'Реализация функционала',
            date: '2025-04-20T23:59',
            status: 'needs_revision',
            review: {
                grade: 68,
                comment: 'Требуется доработать модуль авторизации и исправить баги в API',
                attachments: [
                    { name: 'Список багов.xlsx', url: '/files/bugs.xlsx' }
                ]
            },
            solution: {
                comment: "Передаю работу на проверку",
                attachments: [
                    { name: 'Проектный черновик.docx', url: '/files/bugs.xlsx' }
                ]
            }
        },
        {
            id: 4,
            title: 'Тестирование',
            description: 'Проверка работы системы',
            date: '2025-05-10T23:59'
        },
        {
            id: 5,
            title: 'Внедрение',
            description: 'Развертывание системы у клиента',
            date: '2025-07-19T23:59'
        }
    ];


    return (
        <SAppWrapper>
            <SMain>
                <WorkStages stages={stages} />
            </SMain>

            <SAside>
                <Calendar deadlines={stages} />
            </SAside>
        </SAppWrapper>
    );
};
