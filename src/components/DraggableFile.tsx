import { Box, Typography, useTheme } from "@mui/material";
import { FC, useRef, useState } from "react";
import { FilePresentOutlined } from "@mui/icons-material";

import styled from "styled-components";

interface Props {
  // uploadFile: (file: string | Blob) => Promise<void>;
  accept?: string | undefined;
  file: File | undefined;
  onSelectFile: (file: File | undefined) => void;
}

interface CardProp {
  $boxshadow?: string;
  $padding?: string;
}

const Card = styled.div<CardProp>`
  padding: ${({ $padding }: CardProp) => ($padding ? $padding : "10px")};
  /* box-shadow: ${(p: CardProp) => p.$boxshadow || "0 0 5px #f4f3f9"}; */
  /* border-radius: 5px; */
  overflow: hidden;
`;

interface AreaProp {
  height?: string;
  $bordercolor?: string;
  color?: string;
  $background?: string;
}

const Area = styled.div<AreaProp>`
  height: ${(p: AreaProp) => p.height || "125px"};
  border-radius: 5px;
  border: 2px dashed ${(p: AreaProp) => p.$bordercolor || "#0086fe"};
  color: ${(p: AreaProp) => p.color || "#0086fe"};
  background-color: ${(p: AreaProp) => p.$background || "#f4f3f9"};
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
`;

interface SelectProp {
  color?: string;
}

const Select = styled.div<SelectProp>`
  color: ${(p: SelectProp) => p.color || "#5256ad"};
  margin-left: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: 0, 4s;
  &:hover {
    opacity: 0.6;
  }
`;
const SelecFile = styled.input`
  display: none;
`;
const Container = styled.div`
  margin-top: 0.5rem;
  font-size: 1em;
  cursor: pointer;
`;

export const DraggableFile: FC<Props> = ({ onSelectFile, accept, file }) => {
  const theme = useTheme();

  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function selectFiles() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }
  function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }
  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    onSelectFile(file);
  }
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onSelectFile(selectedFile);
    }
  };

  return (
    <Card $padding="2em" $boxshadow={`0 0 5px ${theme.palette.grey[500]}`}>
      <Area
        $background={theme.palette.background.paper}
        $bordercolor={theme.palette.primary.main}
        color={theme.palette.primary.main}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isDragging ? (
          <Select color={theme.palette.primary.main}>
            Suelte el archivo aqui
          </Select>
        ) : (
          <>
            <Typography fontSize={"1.1em"}>
              Arrastre y suelte aqui o {"  "}
            </Typography>
            <Select
              color={theme.palette.secondary.main}
              role="button"
              onClick={selectFiles}
            >
              Buscar
            </Select>
          </>
        )}
        <SelecFile
          name="file"
          // id="csvFileInput"
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleSelectFile}
        ></SelecFile>
      </Area>
      <Container>
        {file?.name && (
          <Box display="flex">
            <FilePresentOutlined /> {file.name}
          </Box>
        )}
      </Container>
    </Card>
  );
};
