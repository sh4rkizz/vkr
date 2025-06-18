import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { format } from 'date-fns';
import { FiUpload, FiFile, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { css } from 'styled-components';

const STutorSection = ({ reviews }) => {
    const [comment, setComment] = useState('');
    const [grade, setGrade] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [expandedReviewId, setExpandedReviewId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentGrade = reviews.length > 0 ? reviews[0].grade : null;

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(files);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Имитация задержки API
        await new Promise(resolve => setTimeout(resolve, 800));

        const newReview = {
            id: reviews.length + 1,
            date: new Date(),
            grade: parseInt(grade),
            comment,
            tutor: 'Вы',
            reviewerRole: 'Преподаватель',
            attachments: attachments.map(file => file.name),
            isNew: true
        };

        // setReviews([newReview, ...reviews]);
        setComment('');
        setGrade('');
        setAttachments([]);
        setIsSubmitting(false);

        // Автоматически разворачиваем новую проверку
        setExpandedReviewId(newReview.id);
    };

    const toggleReview = (id) => {
        setExpandedReviewId(expandedReviewId === id ? null : id);
    };

    const removeAttachment = (index) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };

    return (
        <Container>
            <ReviewForm onSubmit={handleSubmitReview}>
                <FormTitle>Оценка работы</FormTitle>

                <FormGrid>
                    <FormGroup num>
                        <Label>Оценка</Label>
                        <Input
                            min="0"
                            max="10"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Комментарий</Label>
                        <TextArea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            placeholder="Оставьте развернутый комментарий..."
                        />
                    </FormGroup>

                    <FormGroup style={{ gridColumn: '-1 / 1', marginBottom: "16px" }}>
                        <Label>Прикрепленные файлы</Label>
                        <FileUploadArea tabIndex={0}>
                            <FileInput
                                type="file"
                                id="file-upload"
                                multiple
                                onChange={handleFileUpload}
                            />
                            <FileUploadLabel htmlFor="file-upload">
                                <FiUpload size={20} />
                                <span>Выберите файлы или перетащите их сюда</span>
                            </FileUploadLabel>

                            {attachments.length > 0 && (
                                <FileList>
                                    {attachments.map((file, index) => (
                                        <FileItem key={index}>
                                            <FiFile size={14} />
                                            <FileName>{file.name}</FileName>
                                            <FileSize>{(file.size / 1024).toFixed(1)} KB</FileSize>
                                            <RemoveFile onClick={() => removeAttachment(index)}>×</RemoveFile>
                                        </FileItem>
                                    ))}
                                </FileList>
                            )}
                        </FileUploadArea>
                    </FormGroup>
                </FormGrid>

                <SubmitButton className="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Сохранить оценку
                        </>
                    )}
                </SubmitButton>
            </ReviewForm>

            <ReviewsHistory>
                <HistoryTitle><b>История проверок</b></HistoryTitle>
                {reviews.map(review => (
                    <ReviewItem
                        key={review.id}
                        isNew={review.isNew}
                        isExpanded={true}
                    >
                        <ReviewHeader onClick={() => toggleReview(review.id)}>
                            <ReviewMeta>
                                <ReviewDate>{format(review.date, 'dd.MM.yyyy HH:mm')}</ReviewDate>
                                <ReviewerInfo>
                                    <Reviewer>{review.tutor.name}</Reviewer>
                                    {review.tutor.role && <ReviewerRole>{review.tutor.role}</ReviewerRole>}
                                </ReviewerInfo>
                            </ReviewMeta>

                            <ReviewGrade grade={review.grade}>
                                {review.grade}<span> / 100</span>
                            </ReviewGrade>

                            <ReviewToggle>
                                {expandedReviewId === review.id ? <FiChevronUp /> : <FiChevronDown />}
                            </ReviewToggle>
                        </ReviewHeader>

                        <ReviewContent isExpanded={true}>
                            {review.comment && (
                                <ReviewComment>
                                    <CommentLabel>Комментарий:</CommentLabel>
                                    {review.comment}
                                </ReviewComment>
                            )}

                            {review.attachments.length > 0 && (
                                <ReviewAttachments>
                                    <AttachmentsLabel>Прикрепленные файлы:</AttachmentsLabel>
                                    {review.attachments.map((file, index) => (
                                        <AttachmentLink key={index}>
                                            <FiFile size={14} />
                                            {file.name}
                                        </AttachmentLink>
                                    ))}
                                </ReviewAttachments>
                            )}
                        </ReviewContent>
                    </ReviewItem>
                ))}
            </ReviewsHistory>
        </Container>
    );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled components
const Container = styled.div`
  border-radius: 12px;
  padding: 16px;
  background: white;
`;

const GradeBadge = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 12px 20px;
  border-radius: 12px;
  background: ${({ grade }) =>
        grade >= 9 ? 'linear-gradient(135deg, #4CAF50, #81C784)' :
            grade >= 7 ? 'linear-gradient(135deg, #2196F3, #64B5F6)' :
                grade >= 5 ? 'linear-gradient(135deg, #FFC107, #FFD54F)' :
                    grade !== null ? 'linear-gradient(135deg, #F44336, #E57373)' :
                        '#f5f5f5'};
  color: white;
  font-weight: 600;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px ${({ grade }) =>
        grade >= 9 ? 'rgba(76, 175, 80, 0.3)' :
            grade >= 7 ? 'rgba(33, 150, 243, 0.3)' :
                grade >= 5 ? 'rgba(255, 193, 7, 0.3)' :
                    grade !== null ? 'rgba(244, 67, 54, 0.3)' :
                        'rgba(0, 0, 0, 0.1)'};
`;

const GradeValue = styled.span`
  font-size: 28px;
  font-weight: 700;
`;

const GradeMax = styled.span`
  font-size: 16px;
  opacity: 0.9;
`;

const ReviewForm = styled.form`
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
`;

const FormTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const FormGrid = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const FormGroup = styled.div`
    position: relative;
  grid-column: ${({ fullWidth }) => fullWidth ? '1 / -1' : 'auto'};

  ${({ num }) => num && css`
  width: 70px;
    &::after {
        color: #999;
        content: ' / 100';
        position: absolute;
        display: block;
        right: -16px;
        top: 58%;
        line-height: 1;
        pointer-events: none;
    }
  `}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
font-family: inherit;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
font-family: inherit;
box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.03);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;

  svg {
    color: #9ca3af;
  }

  &:hover {
    color: #3b82f6;

    svg {
      color: #3b82f6;
    }
  }
`;

const FileList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  gap: 8px;
`;

const FileName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.span`
  color: #9ca3af;
  font-size: 14px;
`;

const RemoveFile = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 0 0 8px;

  &:hover {
    color: #ef4444;
  }
`;

const SubmitButton = styled.button`

`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 0.8s linear infinite;
`;

const ReviewsHistory = styled.div`
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid #e5e7eb;
`;

const HistoryTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #555;
`;

const ReviewItem = styled.div`
  margin-bottom: 12px;
  background: white;
  border: 1px solid ${({ isNew }) => isNew ? '#dbeafe' : '#e5e7eb'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ isNew }) => isNew ? '0 0 0 2px #dbeafe' : 'none'};
  animation: ${fadeIn} 0.3s ease-out;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;


  display: grid;
  grid-template-columns: 1fr 500px min-content;

  &:hover {
    background: #f9fafb;
  }
`;

const ReviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReviewDate = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Reviewer = styled.span`
  font-weight: 500;
  color: #111827;
`;

const ReviewerRole = styled.span`
  margin: 0;
  padding: 2px 6px;
  background: #F2F3F5;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
`;

const ReviewGrade = styled.div`
  font-weight: 600;
  color: ${({ grade }) =>
        grade >= 80 ? '#4CAF50' :
            grade >= 70 ? '#2196F3' :
                grade >= 50 ? '#FFC107' :
                    '#F44336'};
  display: flex;
  align-items: baseline;
  gap: 2px;

  span {
    font-size: 14px;
    color: #9ca3af;
    font-weight: normal;
  }
`;

const ReviewToggle = styled.div`
  color: #9ca3af;
  transition: transform 0.2s;
`;

const ReviewContent = styled.div`
  max-height: ${({ isExpanded }) => isExpanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  border-top: ${({ isExpanded }) => isExpanded ? '1px solid #e5e7eb' : 'none'};
`;

const ReviewComment = styled.div`
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  background: #f9fafb;
`;

const CommentLabel = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 13px;
`;

const ReviewAttachments = styled.div`
  padding: 16px;
  border-top: 1px solid #e5e7eb;
`;

const AttachmentsLabel = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 13px;
`;

const AttachmentLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
  }

  svg {
    color: #9ca3af;
  }
`;

export default STutorSection;