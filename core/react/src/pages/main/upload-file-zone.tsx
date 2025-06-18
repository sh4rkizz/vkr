import React from "react";
import styled, { css } from "styled-components";
import materialsStore from "../../../../pages/LessonPage/materials-store";
import { observer } from "mobx-react-lite";
import lessonStore from "../../../../stores/lesson-store";


const SUploadContainer = styled.div`
    display: flex;
    gap: 24px;
    flex-direction: column;
`;

const SUploadZone = styled.div`
    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: flex-end;
`;

const SDropzone = styled.div<{ $disabled: boolean }>`
    display: flex;
    gap: 16px;
    flex-direction: column;
    border: 1px dashed #BEBFC1;
    border-radius: 8px;
    padding:  32px 64px;

    cursor: pointer;
    transition: background-color 0.2s ease-out;

    &:hover {
        background-color: #F2F3F5;
    }

    & > .dropzone-content {
        display: flex;
        gap: 16px;
        flex-direction: column;
        align-items: center;
    }

    ${({ $disabled }) => $disabled && css`
        cursor: not-allowed;

        &:hover {
            background-color: ${colors.white};
        }
    `}
`;

const SDragOrChooseText = styled.div`
    text-align: center;
    display: flex;
    gap: 8px;
    flex-direction: column;

    & > .main-text {
        font-weight: 500;
        font-size: 16px;
        line-height: 100%;
        color: ${colors.black};
    }

    & > .secondary-text {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: #818C99;
    }
`;

const SLoadingText = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #818C99;
    text-align: center;
`;


const UploadIcon = () => <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7 11.5C7 8.46243 9.46243 6 12.5 6C15.1002 6 17.2811 7.8053 17.8533 10.232C17.9622 10.6938 18.3807 11.0155 18.855 11.0021C18.9031 11.0007 18.9515 11 19 11C21.7614 11 24 13.2386 24 16C24 18.7614 21.7614 21 19 21H18C17.4477 21 17 21.4477 17 22C17 22.5523 17.4477 23 18 23H19C22.866 23 26 19.866 26 16C26 12.3298 23.1753 9.31924 19.5813 9.02379C18.5584 6.09869 15.7753 4 12.5 4C8.35786 4 5 7.35786 5 11.5C5 11.6003 5.00197 11.7001 5.00589 11.7996C3.21048 12.8354 2 14.7754 2 17C2 20.3137 4.68629 23 8 23H10C10.5523 23 11 22.5523 11 22C11 21.4477 10.5523 21 10 21H8C5.79086 21 4 19.2091 4 17C4 15.3427 5.00818 13.9185 6.44865 13.3117C6.86549 13.1361 7.11256 12.7026 7.05119 12.2544C7.01748 12.0083 7 11.7564 7 11.5ZM13 24C13 24.5523 13.4477 25 14 25C14.5523 25 15 24.5523 15 24V14.4142L17.2929 16.7071C17.6834 17.0976 18.3166 17.0976 18.7071 16.7071C19.0976 16.3166 19.0976 15.6834 18.7071 15.2929L14.7071 11.2929C14.3166 10.9024 13.6834 10.9024 13.2929 11.2929L9.29289 15.2929C8.90237 15.6834 8.90237 16.3166 9.29289 16.7071C9.68342 17.0976 10.3166 17.0976 10.7071 16.7071L13 14.4142V24Z" fill="#818C99" />
</svg>;


export const UploadFileZone = observer(({ disabled }: { disabled: boolean }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        const inputElement = fileInputRef.current;
        if (inputElement) { inputElement.click(); }
    }

    const handleAddMaterial = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const lessonId = lessonStore.lesson.id;

        if (files.length > 10) {
            window.alertify.notify('За один раз можно загрузить не более 10 файлов', 'error', 5);
            return;
        }

        Array.from(files).forEach((file) => { materialsStore.uploadSingleFile(lessonId, file) });
    }

    return (
        <SUploadContainer>
            {/* TODO Modal tab picker [загрузить файл] / [выбрать из хранилища] */}
            {/* TODO Dropzone */}

            <SUploadZone>
                <SDropzone $disabled={disabled} onClick={handleUploadClick}>
                    <div className="dropzone-content">
                        <span><UploadIcon /></span>

                        <SDragOrChooseText>
                            <span className="main-text">Выберите файл для загрузки</span>
                            <span className="secondary-text">Макс. размер файла — 100 МБ</span>
                        </SDragOrChooseText>

                        <input
                            type="file" ref={fileInputRef} onChange={handleAddMaterial}
                            accept={materialsStore.acceptExtensions.join(',')}
                            multiple hidden
                        />
                    </div>

                    {disabled && <SLoadingText>Файлы загружаются...</SLoadingText>}
                </SDropzone>
            </SUploadZone>
        </SUploadContainer>
    );
});
