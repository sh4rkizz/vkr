import React from "react";
import styled from "styled-components";
import { CloseIcon } from "../../../../icons";
import { SActionButton, SCancelButton, SCloseButton, SModalOverlay } from "./styles";
import { observer } from "mobx-react-lite";
import { pluralize } from "../../../../utils/functions";
import materialsStore from "../../../../pages/LessonPage/materials-store";
import { UploadedFileList } from "./upload-file-list";
import lessonStore from "../../../../stores/lesson-store";
import { UploadFileZone } from "./upload-file-zone";
import { colors, display } from "../../../../constants";
import { FilesExtensionsTooltip } from "./upload-extensions-tooltip";


const SFooter = styled.div`
    display: flex;
    gap: 6px;
    padding: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);

    @media (width < ${display.mobileL}) {
        flex-direction: column-reverse;
    }
`;

const ModalFooter = observer(({ disabled }: { disabled?: boolean }) => {
    const handleCancelClick = () => {
        if (materialsStore.uploadModal_lessonMaterials?.length !== 0) {
            // Есть несохраненные файлы, необходима модалка подтверждения закрытия
            // При этом текущая модалка не закрывается - подтверждение отрисовываем поверх нее
            materialsStore.openResetConfirmationModal();
            return;
        }

        materialsStore.closeUploadModal();
    }

    const handleSaveFilesClick = () => {
        if (!materialsStore.isLoading_save && !disabled) {
            materialsStore.saveUploadedFiles(lessonStore.lesson.id);
        }
    }

    return (
        <SFooter>
            <SCancelButton onClick={handleCancelClick}>Отменить</SCancelButton>

            {materialsStore.uploadModal_lessonMaterials?.length > 0
                ? (
                    <SActionButton disabled={disabled || materialsStore.isLoading_save} onClick={handleSaveFilesClick}>
                        Добавить {materialsStore.uploadModal_lessonMaterials.length}&nbsp;
                        {pluralize(materialsStore.uploadModal_lessonMaterials.length, 'файл', 'файла', 'файлов')}
                    </SActionButton>
                ) : <SActionButton disabled title="Нужно приложить хотя бы 1 файл">Добавить</SActionButton>}
        </SFooter>
    )
});

const SModalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background: ${colors.white};
    border-radius: 12px;
    width: 640px;
    max-width: calc(100vw - 24px);
    box-sizing: border-box;

    min-height: 320px;
    max-height: 90dvh;
`;

const SHeader = styled.div`
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: space-between;

    padding: 20px;
`;

const SModalTitle = styled.span`
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
`;


const SAllowedFormatsWrapper = styled.div`
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: #818C99;
    padding: 0 24px 6px 24px;
`

const SContent = styled.div`
    display: flex;
    gap: 32px;
    flex-direction: column;
    overflow-y: auto;
    padding: 0 24px 24px 24px;
`;

export const UploadModal = observer(() => {
    const handleSafeClose = () => {
        if (materialsStore.uploadModal_lessonMaterials?.length > 0) {
            // Есть несохраненные файлы, необходима модалка подтверждения закрытия
            // При этом текущая модалка не закрывается - подтверждение отрисовываем поверх нее
            materialsStore.openResetConfirmationModal();
            return;
        }

        materialsStore.closeUploadModal();
    }

    const handleCancelClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) { handleSafeClose(); }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            handleSafeClose();
        }
    };

    React.useEffect(() => {
        if (materialsStore.uploadModal_isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [materialsStore.uploadModal_isOpen]);

    if (!materialsStore.uploadModal_isOpen) {
        return null;
    }

    // Файлы продолжают загрузку
    const disableLoading = Object.values(materialsStore.uploadFileStates).filter((state) => !state.loaded).length > 0;

    return (
        <SModalOverlay onMouseDown={handleCancelClick}>
            <SModalWrapper>
                <SHeader>
                    <SModalTitle>Добавление материалов</SModalTitle>
                    <SCloseButton onClick={handleSafeClose}><CloseIcon /></SCloseButton>
                </SHeader>

                <SAllowedFormatsWrapper>
                    <span>Доступные форматы</span>
                    <FilesExtensionsTooltip />
                </SAllowedFormatsWrapper>

                <SContent>
                    <UploadFileZone disabled={disableLoading} />
                    {materialsStore.uploadModal_lessonMaterials?.length > 0 && <UploadedFileList />}
                </SContent>

                <ModalFooter disabled={disableLoading} />
            </SModalWrapper>
        </SModalOverlay>
    );
});
