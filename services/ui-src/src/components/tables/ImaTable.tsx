import {
  Button,
  FormLabel,
  HStack,
  Image,
  Input,
  Radio,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import addIcon from "assets/icons/add/icon_add_blue.svg";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";
import errorIcon from "assets/icons/alert/icon_error.svg";
import { ImaTableColumn, ImaTableRow } from "types";
import { svgFilters } from "styles/foundations/filters";

interface ImaTableProps {
  caption: string;
  columns: ImaTableColumn[];
  rows: ImaTableRow[];
  label?: string;
  helperText?: string;
  addButtonText?: string;
  customRowLabel?: string;
  allowUserCreatedRows?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  onAnswerChange: (rowId: string, columnId: string) => void;
  onDescriptionChange: (rowId: string, description: string) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
}

export const ImaTable = ({
  caption,
  columns,
  rows,
  label,
  helperText,
  addButtonText,
  customRowLabel,
  allowUserCreatedRows = false,
  disabled = false,
  errorMessage,
  onAnswerChange,
  onDescriptionChange,
  onAddRow,
  onDeleteRow,
}: ImaTableProps) => {
  const answerColumns = columns.filter((column) => column.type === "answer");
  const visibleColumns = allowUserCreatedRows
    ? columns
    : columns.filter((column) => column.type !== "delete");

  return (
    <fieldset
      className="ds-c-fieldset"
      style={{ width: "685px", maxWidth: "100%" }}
    >
      {label && (
        <legend
          className="ds-c-label"
          style={{ display: "block", width: "100%", maxWidth: "none" }}
        >
          {label}
        </legend>
      )}
      {helperText && (
        <p className="ds-c-hint" style={{ width: "100%", maxWidth: "none" }}>
          {helperText}
        </p>
      )}
      <Table variant="ima">
        <TableCaption>
          <VisuallyHidden>{caption}</VisuallyHidden>
        </TableCaption>
        <Thead>
          <Tr>
            {visibleColumns.map((column) => (
              <Th key={column.id} scope="col">
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => {
            const rowName = row.description || "new incident type";
            const selectedColumn = answerColumns.find(
              (column) => column.id === row.answer
            );
            return (
              <Tr key={row.id}>
                <Td>
                  {row.isUserCreated ? (
                    <HStack>
                      <FormLabel htmlFor={`description-${row.id}`} margin={0}>
                        {customRowLabel}
                      </FormLabel>
                      <Input
                        id={`description-${row.id}`}
                        value={row.description}
                        backgroundColor="palette.white"
                        borderColor="#262626"
                        isDisabled={disabled}
                        onChange={(event) =>
                          onDescriptionChange(row.id, event.target.value)
                        }
                      />
                    </HStack>
                  ) : (
                    <Text fontSize="body_md">{row.description}</Text>
                  )}
                  {!row.isUserCreated &&
                    selectedColumn?.nonCompliant &&
                    errorMessage && (
                      <HStack
                        role="alert"
                        spacing="0.25rem"
                        alignItems="center"
                      >
                        <Image
                          src={errorIcon}
                          alt=""
                          boxSize="0.75rem"
                          filter={svgFilters.error_darker}
                        />
                        <Text color="palette.error_darker" fontSize="body_md">
                          {errorMessage}
                        </Text>
                      </HStack>
                    )}
                </Td>
                {answerColumns.map((column) => (
                  <Td key={`${row.id}-${column.id}`}>
                    <Radio
                      name={row.id}
                      value={column.id}
                      isDisabled={disabled}
                      isChecked={row.answer === column.id}
                      onChange={() => onAnswerChange(row.id, column.id)}
                    >
                      <VisuallyHidden>{`${column.label} for ${rowName}`}</VisuallyHidden>
                    </Radio>
                  </Td>
                ))}
                {allowUserCreatedRows && (
                  <Td>
                    {row.isUserCreated && (
                      <Button
                        variant="link"
                        isDisabled={disabled}
                        aria-label={`Delete ${rowName}`}
                        onClick={() => onDeleteRow(row.id)}
                      >
                        <Image src={cancelIcon} alt="" />
                      </Button>
                    )}
                  </Td>
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {allowUserCreatedRows && (
        <Button
          variant="outline"
          leftIcon={<Image src={addIcon} alt="" />}
          isDisabled={disabled}
          onClick={onAddRow}
        >
          {addButtonText}
        </Button>
      )}
    </fieldset>
  );
};
