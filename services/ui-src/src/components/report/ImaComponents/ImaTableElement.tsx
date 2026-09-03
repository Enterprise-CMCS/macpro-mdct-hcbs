import { useState } from "react";
import { ImaTable } from "components";
import { ImaTableRow, ImaTableTemplate } from "types";
import { PageElementProps } from "../Elements";

export const ImaTableElement = (props: PageElementProps<ImaTableTemplate>) => {
  const { element, updateElement, disabled = false } = props;
  const { caption, columns } = element;

  const [rows, setRows] = useState<ImaTableRow[]>(
    structuredClone(element.answer) ?? structuredClone(element.rows)
  );

  const save = (updatedRows: ImaTableRow[]) => {
    setRows(updatedRows);
    updateElement({ answer: updatedRows });
  };

  const onAnswerChange = (rowId: string, answer: "yes" | "no") => {
    save(rows.map((row) => (row.id === rowId ? { ...row, answer } : row)));
  };

  const onDeleteRow = (rowId: string) => {
    save(rows.filter((row) => row.id !== rowId));
  };

  return (
    <ImaTable
      {...{
        caption,
        columns,
        rows,
        disabled,
        onAnswerChange,
        onDeleteRow,
      }}
    />
  );
};
