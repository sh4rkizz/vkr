import styled from "styled-components";
import { colors } from "../../../../constants";


export const SModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.12);

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 12px;
`;

export const SCloseButton = styled.button`
    font-size: 20px;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;

    outline: none;
    border: none;
    background: ${colors.white};
    color: ${colors.black};

    transition:
        color .2s ease-out,
        background-color .2s ease-out;

    display: flex;
    justify-content: center;
    box-sizing: border-box;

    &:hover, &:focus-visible {
        background-color: ${colors.hoverWhiteButtonBackground};
        color: ${colors.blueTextVK};
    }

    &:focus-visible {
        outline: 1px solid ${colors.blueTextVK};
    }
`;

const SButton = styled.button`
    outline: none;
    border: none;

    padding: 0;
    margin: 0;

    cursor: pointer;
    transition:
        color .2s ease-out,
        background-color .2s ease-out;

    width: 100%;

    font-size: 18px;
    line-height: 26px;
    font-weight: 500;
    padding: 12px 20px;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
`;

export const SActionButton = styled(SButton)`
    color: ${colors.white};
    background: ${colors.blueTextVK};

    &:hover {
        background: rgba(0, 119, 255, 0.75);
    }

    &:focus-visible {
        outline: 1px solid ${colors.blueTextVK};
        outline-offset: 2px;
    }

    &:disabled {
        background: rgba(0, 119, 255, 0.75);
        cursor: not-allowed;
    }
`;

export const SCancelButton = styled(SButton)`
    color: ${colors.blueTextVK};
    background: #F7F8FA;

    &:hover {
        background: #EAEAEA;
    }

    &:focus-visible {
        outline: 1px solid ${colors.blueTextVK};
    }
`;
