import React, { useState } from 'react';
import styled from 'styled-components';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO,
    isBefore,
    addDays,
    subWeeks,
    isAfter,
    startOfWeek,
    endOfWeek
} from 'date-fns';
import { ru } from 'date-fns/locale';

const Calendar = ({ deadlines }) => {
    const [hoveredDate, setHoveredDate] = useState(null);
    const now = new Date();

    // Группируем дедлайны по месяцам и фильтруем прошедшие месяцы
    const deadlinesByMonth = deadlines.reduce((acc, deadline) => {
        const deadlineDate = parseISO(deadline.date);

        if (deadlineDate.getMonth() === 2) return acc;

        const monthKey = format(deadlineDate, 'yyyy-MM');
        if (!acc[monthKey]) {
            acc[monthKey] = {
                monthStart: startOfMonth(deadlineDate),
                deadlines: []
            };
        }
        acc[monthKey].deadlines.push(deadline);
        return acc;
    }, {});

    // Сортируем месяцы по дате
    const sortedMonths = Object.values(deadlinesByMonth).sort((a, b) =>
        a.monthStart - b.monthStart
    );

    // Функция для получения дней подготовки (неделя перед дедлайном)
    const getPreparationDays = (deadlineDate) => {
        const start = subWeeks(deadlineDate, 1);
        const end = addDays(deadlineDate, -2);
        return eachDayOfInterval({ start, end });
    };

    // Собираем все дни подготовки из всех дедлайнов
    const allPreparationDays = deadlines.flatMap(deadline => {
        const deadlineDate = parseISO(deadline.date);
        return getPreparationDays(deadlineDate);
    });

    return (
        <CalendarContainer>
            {sortedMonths.map(({ monthStart, deadlines: monthDeadlines }) => {
                const monthEnd = endOfMonth(monthStart);
                const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

                return (
                    <MonthContainer key={monthStart.toString()}>
                        <MonthTitle>{format(monthStart, 'LLLL yyyy', { locale: ru })}</MonthTitle>

                        <CalendarGrid>
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                <DayHeader key={day}>{day}</DayHeader>
                            ))}

                            {daysInMonth.map(day => {
                                const dayDeadlines = monthDeadlines.filter(deadline =>
                                    isSameDay(parseISO(deadline.date), day)
                                );

                                // Проверяем, является ли день частью подготовки к любому дедлайну
                                const isPreparationDay = allPreparationDays.some(prepDay =>
                                    isSameDay(prepDay, day)
                                );

                                const hasDeadlines = dayDeadlines.length > 0;
                                const isToday = isSameDay(day, now);

                                return (
                                    <DayCell
                                        key={day.toString()}
                                        onMouseEnter={() => setHoveredDate(day)}
                                        onMouseLeave={() => setHoveredDate(null)}
                                        isToday={isToday}
                                        isPast={isBefore(day, now) && !isToday}
                                    >
                                        <DayNumber>{format(day, 'd')}</DayNumber>
                                        {isPreparationDay && <PreparationMarker />}
                                        {hasDeadlines && <DeadlineMarker />}

                                        {hoveredDate && isSameDay(day, hoveredDate) && (
                                            <DeadlinePopup>
                                                {isPreparationDay && (
                                                    <PreparationInfo>
                                                        Оптимальное время для загрузки работы
                                                    </PreparationInfo>
                                                )}
                                                {dayDeadlines.map(deadline => (
                                                    <DeadlineItem key={deadline.id}>
                                                        <strong>{deadline.title}</strong>
                                                        <p>{deadline.description}</p>
                                                        <small>До: {format(parseISO(deadline.date), 'dd.MM.yyyy HH:mm')}</small>
                                                    </DeadlineItem>
                                                ))}
                                            </DeadlinePopup>
                                        )}
                                    </DayCell>
                                );
                            })}
                        </CalendarGrid>
                    </MonthContainer>
                );
            })}
        </CalendarContainer>
    );
};

// ... остальные стили остаются без изменений ...

// Стилизация компонентов
const CalendarContainer = styled.aside`
    box-sizing: border-box;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
`;

const MonthContainer = styled.div`
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const MonthTitle = styled.h3`
    margin: 0 0 12px 0;
    font-size: 16px;
    text-align: center;
    color: #333;
    font-weight: 600;
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

const DayHeader = styled.div`
    text-align: center;
    font-weight: bold;
    font-size: 11px;
    padding: 4px;
    color: #666;
`;

const DayCell = styled.div`
    position: relative;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    background-color: ${props => props.isToday ? '#e3f2fd' : 'transparent'};
    color: ${props => props.isPast ? '#aaa' : '#333'};

    &:hover {
        background-color: ${props => props.isPast ? '#f5f5f5' : '#f0f0f0'};
    }
`;

const DayNumber = styled.span``;

const PreparationMarker = styled.div`
    position: absolute;
    bottom: -2px;
    width: 6px;
    height: 6px;
    border-radius: 2px;
    background-color: #4caf50;
`;

const DeadlineMarker = styled.div`
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ff4757;
`;

const DeadlinePopup = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 10;
    width: 220px;
    padding: 12px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 13px;
`;

const PreparationInfo = styled.div`
    padding: 6px;
    margin-bottom: 8px;
    background-color: #e8f5e9;
    color: #2e7d32;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
`;

const DeadlineItem = styled.div`
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;

    &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
    }

    strong {
        display: block;
        margin-bottom: 4px;
        color: #333;
        font-size: 14px;
    }

    p {
        margin: 4px 0;
        color: #666;
        font-size: 13px;
    }

    small {
        color: #888;
        font-size: 12px;
    }
`;

export default Calendar;