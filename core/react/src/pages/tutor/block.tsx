import { format } from 'date-fns';
import React from 'react';
import styled from 'styled-components';
import STutorSection from './check-block';

const ResponseBlock = () => {
    const solution = {
        id: 1,
        date: '2025-05-30T20:00',
        comment: "Передаю работу на проверку",
        attachments: [
            { name: 'Проектирование.docx', url: '/files/comments2.docx', date: '2025-05-30T19:55', },
            { name: 'IDEFO.png', url: '/files/comments2.docx', date: '2025-05-30T19:50', },
            { name: 'DFD.png', url: '/files/comments2.docx', date: '2025-05-30T19:50', },
        ],
        reviews: [
            {
                id: 2,
                grade: 87,
                date: '2025-06-01T10:00',
                tutor: { id: 1, name: 'Анна Петрова', role: 'Старший преподаватель' },
                comment: 'Требуется доработать модуль авторизации и исправить баги в API',
                attachments: [
                    { name: 'Список багов.xlsx', url: '/files/comments2.docx', date: '2025-05-31T20:00', }
                ],
                isNew: false
            },
            {
                id: 2,
                date: '2025-06-02T10:00',
                grade: 60,
                comment: 'Есть несколько ошибок в логике. Пожалуйста, исправьте разделы 2.3 и 3.1.',
                tutor: { id: 1, name: 'Иван Сидоров', role: 'Ассистент' },
                reviewer: 'Иван Сидоров',
                reviewerRole: 'Ассистент',
                attachments: [],
                isNew: false
            }
        ],
    }

    return (
        <Container>
            <SMainBlock>
                <SMeta>
                    <Header>
                        <ResponseInfo>
                            <b style={{ fontSize: "20px" }}>Попытка сдачи #{solution.id}</b>
                            <span>{format(new Date(solution.date), 'dd.MM.yyyy в HH:mm')}</span>
                        </ResponseInfo>
                    </Header>

                    <Comment>{solution.comment}</Comment>

                    {solution.attachments?.length > 0 && <FilesSection>
                        <FilesTitle>Файлы:</FilesTitle>
                        <FileListWrapper>
                            {solution.attachments.map((file, idx) => <FileItem key={idx}>
                                <FileName>
                                    <span>{idx + 1}. {file.name}</span>
                                </FileName>

                                <FileDate>{format(new Date(file.date), 'dd.MM.yyyy HH:mm')}</FileDate>

                                <FileActions>
                                    <FileLink href="#">Посмотреть</FileLink> / <FileLink href="#">Скачать</FileLink>
                                </FileActions>
                            </FileItem>)}
                        </FileListWrapper>
                        <DownloadAll  href="#">Скачать все файлы</DownloadAll>
                    </FilesSection>}
                </SMeta>

                {solution.reviews.length > 0 && <SMarks>
                    <Header>
                        <ResponseInfo>
                            <b style={{ fontSize: "20px" }}>Актуальная оценка</b>
                            <span>{format(new Date(solution.reviews[0].date), 'dd.MM.yyyy в HH:mm')}</span>
                        </ResponseInfo>
                    </Header>

                    <ReviewerInfo>
                        <Reviewer>{solution.reviews[0].tutor.name}</Reviewer>
                        {solution.reviews[0].tutor.role && <ReviewerRole>{solution.reviews[0].tutor.role}</ReviewerRole>}
                    </ReviewerInfo>

                    <GradeBadge grade={solution.reviews[0].grade}>
                        Оценка: {solution.reviews[0].grade} из 100
                    </GradeBadge>

                    <Comment>{solution.reviews[0].comment}</Comment>
                </SMarks>}
            </SMainBlock>

            <STutorSection reviews={solution.reviews} />
        </Container>
    );
};

const GradeBadge = styled.span`
width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
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

const SMainBlock = styled.div`
    display: flex;
    flex-direction: row;
    padding: 12px 0 0 0;
`;

const SMeta = styled.div`
    display: flex;
    gap: 12px;
    flex-direction: column;
    padding: 0 16px 0 16px;
`;

const SMarks = styled.div`
    border-left: 1px solid #e5e7eb;
    flex: 1;
    display: flex;
    gap: 12px;
    flex-direction: column;
    padding: 0 16px 0 16px;
`;

// Styled components
const Container = styled.div`
    box-sizing: border-box;
    background-color: #fFF;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
`;

const FileListWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
`;

const ResponseInfo = styled.div`
    font-size: 16px;
    color: #555;
    display: flex;
    gap: 8px;
    justify-content: space-between;
`;

const Comment = styled.div`
  margin: 0;
  padding: 10px;
  background: #F2F3F5;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
`;

const FilesSection = styled.div`
`;

const FilesTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const FileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  width: 200px;
`;

const FileName = styled.b`
  display: flex;
  white-space: nowrap;
  gap: 8px;
  font-size: 14px;
`;

const FileActions = styled.div`
margin-top: -8px;
  /* display: flex;
  flex-direction: column;
  align-items: flex-end; */
`;

const FileLink = styled.a`
  color: #0077FF;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FileDate = styled.div`
  font-size: 14px;
  color: #777;
`;

const DownloadAll = styled.a`
  display: inline-block;
  color: #0077FF;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 16px 0;
`;

const PointsSection = styled.div``;

const PointsTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const PointsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const PointsRow = styled.tr`
  text-align: center;
`;

const PointCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const HistoryTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const HistoryItem = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;

export default ResponseBlock;