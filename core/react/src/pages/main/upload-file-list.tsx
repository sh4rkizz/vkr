import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { colors } from "../../../../constants";
import materialsStore, { IUploadModalFile } from "../../../../pages/LessonPage/materials-store";


export const SFileWrapper = styled.div`
    border-radius: 8px;
    gap: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    border-width: 1px;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
    text-decoration: none;
`;

const SFileExtension = styled.span`
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 18px;
    color: ${colors.white};
    background: #E64646;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SFileName = styled.span`
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: ${colors.black};

    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const ModalFileItem = ({ file }: { file: IUploadModalFile }) => {
    return (
        <SFileWrapper>
            <SFileExtension>{file.extension}</SFileExtension>
            <SFileName>{file.filename}</SFileName>
        </SFileWrapper>
    );
}


const SUploadedFileListWrapper = styled.div`
    display: flex;
    gap: 12px;
    flex-direction: column;
`;

const SUploadedFilesHeader = styled.div`
    display: flex;
    gap: 12px;
    flex-direction: column;
`;

const SMainText = styled.span`
    font-weight: 500;
    font-size: 16px;
    line-height: 100%;
    color: ${colors.black};

    display: flex;
    gap: 8px;
    flex-direction: row;
    align-items: center;
`;

const SSecondaryText = styled.span`
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #818C99;
`;

const SUploadedFileList = styled.div`
    overflow-y: auto;
    max-height: 200px;
    display: flex;
    gap: 8px;
    flex-direction: column;
`;


export const UploadedFileList = observer(() => {
    return (
        <SUploadedFileListWrapper>
            <SUploadedFilesHeader>
                <SMainText>
                    <span>Загруженные файлы</span>
                    <SSecondaryText>{materialsStore.uploadModal_lessonMaterials.length}</SSecondaryText>
                </SMainText>

                <SSecondaryText>
                    После добавления файлов вам станет доступна функция
                    редактирования названия и&nbsp;добавления описания
                </SSecondaryText>
            </SUploadedFilesHeader>

            <SUploadedFileList>
                {materialsStore.uploadModal_lessonMaterials.map((lm) => <ModalFileItem key={lm.id} file={lm} />)}
            </SUploadedFileList>
        </SUploadedFileListWrapper>
    );
});
