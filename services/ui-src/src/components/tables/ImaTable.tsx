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
  allowCustomRows?: boolean;
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
  allowCustomRows = false,
  disabled = false,
  errorMessage,
  onAnswerChange,
  onDescriptionChange,
  onAddRow,
  onDeleteRow,
}: ImaTableProps) => {
  const answerColumns = columns.filter((column) => column.type === "answer");
  const visibleColumns = allowCustomRows
    ? columns
    : columns.filter((column) => column.type !== "delete");

  return (
    <fieldset className="ds-c-fieldset">
      {label && <legend className="ds-c-label">{label}</legend>}
      {helperText && <p className="ds-c-hint">{helperText}</p>}

      {allowCustomRows && (
        <Button
          variant="outline"
          leftIcon={<Image src={addIcon} alt="" />}
          isDisabled={disabled}
          onClick={onAddRow}
        >
          {addButtonText}
        </Button>
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
                  {row.custom ? (
                    <HStack>
                      <FormLabel htmlFor={`description-${row.id}`} margin={0}>
                        {customRowLabel}
                      </FormLabel>
                      <Input
                        id={`description-${row.id}`}
                        value={row.description}
                        isDisabled={disabled}
                        onChange={(event) =>
                          onDescriptionChange(row.id, event.target.value)
                        }
                      />
                    </HStack>
                  ) : (
                    <Text>{row.description}</Text>
                  )}
                  {!row.custom &&
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
                        <Text color="palette.error_darker" fontSize="body_xs">
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
                {allowCustomRows && (
                  <Td>
                    {row.custom && (
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
      {allowCustomRows && (
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
