import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { format, isAfter, isBefore } from 'date-fns';

// Базовые стили для временной шкалы
const TimelineContainer = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 40px;
  left: 34px;
  height: calc(100% - 80px);
  width: 4px;
  background-color: #e0e0e0;
  z-index: 1;
`;

const StagesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 2;
`;

const StageItem = styled.li`
  display: flex;
  margin-bottom: 12px;
  position: relative;
`;

const StageMarker = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #d1d5db;
  margin-right: 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  border: 4px solid white;

  ${props => props.active && css`
    background-color: #0077FF;
    transform: scale(1.2);
  `}

  ${props => (props.completed || props.status === 'approved') && css`
    background-color: #10b981;
  `}
`;

const StageContent = styled.div`
  flex-grow: 1;
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 3px solid transparent;

  ${props => props.active && css`
    border-left-color: #0077FF;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  `}

  ${props => (props.completed || props.status === 'approved') && css`
    border-left-color: #10b981;
  `}
`;

const StageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  cursor: ${props => props.collapsible ? 'pointer' : 'default'};
`;

const StageTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #1f2937;

  ${props => props.active && css`
    color: #0077FF;
    font-weight: 600;
  `}
`;

const StageDate = styled.span`
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
`;

const StageDescription = styled.p`
  margin: 8px 0 0 0;
  color: #4b5563;
  font-size: 15px;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const StageStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  ${props => props.status === 'completed' && css`
    background-color: #d1fae5;
    color: #065f46;
  `}

  ${props => props.status === 'approved' && css`
    background-color: #d1fae5;
    color: #065f46;
  `}

  ${props => props.status === 'in_progress' && css`
    background-color: #fef3c7;
    color: #92400e;
  `}

  ${props => props.status === 'needs_revision' && css`
    background-color: #fee2e2;
    color: #b91c1c;
  `}

  ${props => props.status === 'pending' && css`
    background-color: #f3f4f6;
    color: #6b7280;
  `}

  ${props => props.status === 'overdue' && css`
    background-color: #fee2e2;
    color: #b91c1c;
  `}
`;

// Стили для модального окна
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #1f2937;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4b5563;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: block;
  padding: 10px 15px;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s;

  &:hover {
    border-color: #0077FF;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-height: 100px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: #0077FF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

// Стили для блока проверки
const StageStatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  display: ${props => props.collapsed ? 'none' : 'flex'};
`;

const UploadButton = styled.button`
  /* padding: 6px 12px; */
  background: #0077FF;
  color: white;
  /* border: none; */
  border-radius: 8px;
  /* font-size: 14px; */
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const ReviewBlock = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: #374151;
`;

const GradeBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props =>
        props.grade >= 85 ? '#d1fae5' :
            props.grade >= 70 ? '#fef3c7' :
                '#fee2e2'};
  color: ${props =>
        props.grade >= 85 ? '#065f46' :
            props.grade >= 70 ? '#92400e' :
                '#b91c1c'};
`;

const ReviewComment = styled.p`
  margin: 0;
  padding: 10px;
  background: #F2F3F5;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
`;

const ReviewAttachments = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #4b5563;

  span {
    display: block;
    margin-bottom: 5px;
  }
`;

const AttachmentLink = styled.a`
  display: inline-block;
  margin-right: 10px;
  color: #0077FF;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ToggleIcon = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: #6b7280;
`;

// Компонент модального окна
const UploadModal = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        onUpload({ file, comment }).finally(() => {
            setIsSubmitting(false);
            onClose();
        });
    };

    return (
        <ModalOverlay>
            <ModalContainer>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <ModalTitle>Загрузка работы</ModalTitle>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Файл работы *</Label>
                        <FileInput
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                        <FileLabel>
                            {file ? file.name : 'Выберите файл'}
                        </FileLabel>
                    </FormGroup>
                    <FormGroup>
                        <Label>Комментарий (необязательно)</Label>
                        <TextArea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Добавьте комментарий к работе..."
                        />
                    </FormGroup>
                    <SubmitButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Отправить работу'}
                    </SubmitButton>
                </form>
            </ModalContainer>
        </ModalOverlay>
    );
};

// Основной компонент
const WorkStagesTimeline = ({ stages, onUploadWork }) => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentStage, setCurrentStage] = useState(null);

    const completedStagesIds = stages.map(s => ['completed', 'approved'].includes(s.status) && s.id).filter(Boolean);

    const [collapsedStages, setCollapsedStages] = useState(() => {
        return completedStagesIds.reduce((acc, item) => {
            acc[item] = true;
            return acc;
        }, {})
    });

    const getActiveStageIndex = () => {
        const now = new Date();

        const inProgressIndex = stages.findIndex(
            stage => stage.status === 'in_progress' || stage.status === 'needs_revision'
        );
        if (inProgressIndex !== -1) return inProgressIndex;

        const futureStages = stages.filter(
            stage => new Date(stage.date) > now
        );

        if (futureStages.length > 0) {
            return stages.indexOf(futureStages[0]);
        }

        return stages.length - 1;
    };

    const activeIndex = getActiveStageIndex();
    const now = new Date();

    const toggleStageCollapse = (stageId) => {
        setCollapsedStages(prev => ({
            ...prev,
            [stageId]: !prev[stageId]
        }));
    };

    const handleUploadClick = (stage) => {
        setCurrentStage(stage);
        setUploadModalOpen(true);
    };

    const handleUpload = async (uploadData) => {
        await onUploadWork(currentStage.id, uploadData);
    };

    return (
        <>
            <TimelineContainer>
                <TimelineLine />
                <StagesList>
                    {stages.map((stage, index) => {
                        const isActive = index === activeIndex;
                        const isCompleted = index < activeIndex;
                        const stageDate = new Date(stage.date);
                        const isFuture = isAfter(stageDate, now);
                        const isCollapsible = isCompleted || isFuture;
                        const isCollapsed = collapsedStages[stage.id] && isCollapsible;

                        let statusDisplay = stage.status || 'pending';
                        // if (!isCompleted && stageDate < now && !['completed', 'approved'].includes(statusDisplay)) {
                        //     statusDisplay = 'overdue';
                        // }

                        return (
                            <StageItem key={stage.id}>
                                {/* <StageMarker
                                    active={isActive}
                                    completed={isCompleted}
                                    status={statusDisplay}
                                /> */}
                                <StageContent
                                    active={isActive}
                                    completed={isCompleted}
                                    status={statusDisplay}
                                >
                                    <StageHeader
                                        collapsible={isCollapsible}
                                        onClick={() => isCollapsible && toggleStageCollapse(stage.id)}
                                    >
                                        <StageTitle active={isActive}>
                                            {stage.title}
                                        </StageTitle>

                                        <StageStatus status={statusDisplay}>
                                            {statusDisplay === 'completed' && 'Завершено'}
                                            {statusDisplay === 'approved' && 'Принято'}
                                            {statusDisplay === 'in_progress' && 'В процессе'}
                                            {statusDisplay === 'needs_revision' && 'Требует доработки'}
                                            {statusDisplay === 'pending' && 'Ожидается'}
                                            {statusDisplay === 'overdue' && 'Просрочено'}
                                        </StageStatus>

                                        <StageDate>
                                            {format(new Date(stage.date), 'dd.MM.yyyy')}
                                        </StageDate>
                                    </StageHeader>

                                    <StageDescription collapsed={isCollapsed}>
                                        {stage.description}
                                    </StageDescription>

                                    {!!stage.solution && <ReviewBlock collapsed={isCollapsed}>
                                        <ReviewHeader>
                                            <ReviewTitle>Твой ответ:</ReviewTitle>
                                        </ReviewHeader>

                                        {stage.solution.comment && (
                                            <ReviewComment>
                                                {stage.solution.comment}
                                            </ReviewComment>
                                        )}

                                        {stage.solution.attachments && (
                                            <ReviewAttachments>
                                                <span>Прикрепленные файлы:</span>
                                                {stage.solution.attachments.map(file => (
                                                    <AttachmentLink
                                                        key={file.name}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {file.name}
                                                    </AttachmentLink>
                                                ))}
                                            </ReviewAttachments>
                                        )}
                                    </ReviewBlock>}

                                    <StageStatusContainer collapsed={isCollapsed}>
                                        {['in_progress', 'needs_revision'].includes(statusDisplay) && (
                                            <UploadButton onClick={() => handleUploadClick(stage)}>
                                                Загрузить работу
                                            </UploadButton>
                                        )}
                                    </StageStatusContainer>

                                    {!!stage.review && (
                                        <ReviewBlock collapsed={isCollapsed}>
                                            <ReviewHeader>
                                                <ReviewTitle>Проверка преподавателя:</ReviewTitle>
                                                {stage.review.grade && (
                                                    <GradeBadge grade={stage.review.grade}>
                                                        Оценка: {stage.review.grade}
                                                    </GradeBadge>
                                                )}
                                            </ReviewHeader>
                                            {stage.review.comment && (
                                                <ReviewComment>
                                                    {stage.review.comment}
                                                </ReviewComment>
                                            )}
                                            {stage.review.attachments && (
                                                <ReviewAttachments>
                                                    <span>Прикрепленные файлы:</span>
                                                    {stage.review.attachments.map(file => (
                                                        <AttachmentLink
                                                            key={file.name}
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {file.name}
                                                        </AttachmentLink>
                                                    ))}
                                                </ReviewAttachments>
                                            )}
                                        </ReviewBlock>
                                    )}
                                </StageContent>
                            </StageItem>
                        );
                    })}
                </StagesList>
            </TimelineContainer>

            <UploadModal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onUpload={handleUpload}
            />
        </>
    );
};

const App = ({ stages }) => {
    const handleUploadWork = async (stageId, { file, comment }) => {
        console.log('Uploading work for stage:', stageId);
        console.log('File:', file);
        console.log('Comment:', comment);
        // Здесь должна быть реальная логика загрузки
        return new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
        <div>
            <h2>Этапы выполнения &laquo;Курсовой проект&raquo;</h2>
            <WorkStagesTimeline
                stages={stages}
                onUploadWork={handleUploadWork}
            />
        </div>
    );
};

export default App;