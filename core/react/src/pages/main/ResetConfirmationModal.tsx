import React from "react";
import styled from "styled-components";
import { colors, display } from "../../../../constants";
import { SActionButton, SCancelButton, SCloseButton, SModalOverlay } from "./styles";
import { CloseIcon } from "../../../../icons";
import materialsStore from "../../../../pages/LessonPage/materials-store";
import { observer } from "mobx-react-lite";


const SModalWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background: ${colors.white};
    border-radius: 12px;
    padding: 24px;
    box-sizing: border-box;

    width: 480px;
    min-height: 320px;
    max-height: 80dvh;
`;

const SHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const SContent = styled.div`
    padding: 0 12px;
    display: flex;
    gap: 8px;
    flex-direction: column;
`;

const SMainText = styled.span`
    text-align: center;
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
`;

const SSecondaryText = styled.span`
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: ${colors.grayTextVK};
`;

const SFooter = styled.div`
    display: flex;
    gap: 6px;
    flex-direction: row;
    margin-top: 32px;

    @media (width < ${display.mobileL}) {
        flex-direction: column-reverse;
    }
`;


export const ResetConfirmationModal = observer(() => {
    const handleSafeClose = () => {
        materialsStore.closeResetConfirmationModal();
    }

    const handleOutsideClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            handleSafeClose();
        }
    }

    const handleConfirmResetClick = () => {
        materialsStore.resetModals();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            handleSafeClose();
        }
    };

    React.useEffect(() => {
        if (materialsStore.resetConfirmationModal_isOpen) {
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
    }, [materialsStore.resetConfirmationModal_isOpen]);

    if (!materialsStore.resetConfirmationModal_isOpen) {
        return null;
    }

    return (
        <SModalOverlay onMouseDown={handleOutsideClick}>
            <SModalWrapper>
                <SHeader>
                    <SCloseButton onClick={handleSafeClose}>
                        <CloseIcon />
                    </SCloseButton>
                </SHeader>

                <SContent>
                    <SMainText>Сохранение файлов не&nbsp;завершено</SMainText>

                    <SSecondaryText>
                        Вы&nbsp;загрузили файлы, которые еще не&nbsp;были добавлены в&nbsp;курс.
                        Если вы&nbsp;закроете окно сейчас, все несохраненные данные будут потеряны.
                        Вы&nbsp;уверены, что хотите закрыть окно?
                    </SSecondaryText>
                </SContent>

                <SFooter>
                    <SCancelButton onClick={handleSafeClose}>Вернуться</SCancelButton>
                    <SActionButton onClick={handleConfirmResetClick}>Да, закрыть</SActionButton>
                </SFooter>
            </SModalWrapper>
        </SModalOverlay>
    );
})
