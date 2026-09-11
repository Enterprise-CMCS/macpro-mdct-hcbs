import { useState } from "react";
import { ImaTable } from "components";
import { ImaTableRow, ImaTableTemplate } from "types";
import { PageElementProps } from "../Elements";

const identifyUserCreatedRows = (
  tableRows: ImaTableRow[],
  templateRows: ImaTableRow[]
) => {
  const templateRowIds = new Set(templateRows.map((row) => row.id));

  return tableRows.map((row) => {
    if (row.isUserCreated !== undefined) return row;

    return templateRowIds.has(row.id) ? row : { ...row, isUserCreated: true };
  });
};

const removeEmptyUserCreatedRows = (tableRows: ImaTableRow[]) =>
  tableRows.filter(
    (row) => !row.isUserCreated || row.description.trim().length > 0
  );

export const ImaTableElement = (props: PageElementProps<ImaTableTemplate>) => {
  const { element, updateElement, disabled = false } = props;
  const {
    caption,
    columns,
    label,
    helperText,
    addButtonText,
    userCreatedRowLabel,
    errorMessage,
    allowUserCreatedRows,
  } = element;

  const [rows, setRows] = useState<ImaTableRow[]>(() =>
    removeEmptyUserCreatedRows(
      identifyUserCreatedRows(
        structuredClone(element.answer ?? element.rows),
        element.rows
      )
    )
  );

  const save = (updatedRows: ImaTableRow[]) => {
    setRows(updatedRows);
    updateElement({ answer: removeEmptyUserCreatedRows(updatedRows) });
  };

  const onAnswerChange = (rowId: string, columnId: string) => {
    save(
      rows.map((row) => (row.id === rowId ? { ...row, answer: columnId } : row))
    );
  };

  const onDescriptionChange = (rowId: string, description: string) => {
    save(rows.map((row) => (row.id === rowId ? { ...row, description } : row)));
  };

  const onAddRow = () => {
    save([
      ...rows,
      { id: crypto.randomUUID(), description: "", isUserCreated: true },
    ]);
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
        label,
        helperText,
        addButtonText,
        userCreatedRowLabel,
        errorMessage,
        allowUserCreatedRows,
        disabled,
        onAnswerChange,
        onDescriptionChange,
        onAddRow,
        onDeleteRow,
      }}
    />
  );
};
