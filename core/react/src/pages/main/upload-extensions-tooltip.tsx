import React from "react";
import styled from "styled-components";
import { colors } from "../../../../constants";
import Tooltip from "../../../common/tooltip";


const SExtensionsTooltip = styled.ul`
    display: flex;
    gap: 8px;
    flex-direction: column;
    list-style: none;
`;

const SExtensionVariants = styled.li`
    list-style: none;
    display: flex;
    gap: 2px;
    flex-direction: column;
`;

const SVariantTitle = styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: ${colors.grayTextVK};
`;

const SVariantItem = styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: ${colors.black};
`;


export const FilesExtensionsTooltip = () => {
    const extensionVariants = [
        { label: 'Презентации', value: ".ppt, .pptx" },
        { label: 'Таблицы', value: ".csv, .xls, .xlsx" },
        { label: 'Документы', value: ".pdf, .doc, .docx, .txt, .odt" },
        { label: 'Картинки', value: ".png, .jpg, .jpeg" },
        { label: 'Архивы', value: ".zip" },
        { label: 'Сниппеты кода', value: ".py, .h, .rb, .sc, .sh, .d, .java, .erl, .js, .kt, .hs, .mjs, .c, .fs, .ts, .scala, .php, .xsd, .hpp, .cs, .cpp, .go, .swift, .rs, .xml, .pas, .json" },
    ]

    return (
        <Tooltip posLeft>
            <SExtensionsTooltip>
                {extensionVariants.map(({ label, value }) => <SExtensionVariants key={label}>
                    <SVariantTitle>{label}:</SVariantTitle>
                    <SVariantItem>{value}</SVariantItem>
                </SExtensionVariants>)}
            </SExtensionsTooltip>
        </Tooltip>
    );
}
