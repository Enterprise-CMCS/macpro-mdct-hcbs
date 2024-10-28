import { Accordion, ListItem, UnorderedList } from "@chakra-ui/react";
import { AccordionItem, Table } from "components";
import { AnyObject } from "types";
import { parseCustomHtml } from "utils";

export const TemplateCardAccordion = ({ verbiage, ...props }: Props) => (
  <Accordion allowToggle={true} {...props}>
    <AccordionItem label={verbiage.buttonLabel}>
      {parseCustomHtml(verbiage.text)}
      {verbiage.table && <Table content={verbiage.table} variant="striped" />}
      {verbiage.list && (
        <UnorderedList variant="accordion">
          {verbiage.list.map((listItem: string, index: number) => (
            <ListItem key={index}>{listItem}</ListItem>
          ))}
        </UnorderedList>
      )}
    </AccordionItem>
  </Accordion>
);

interface Props {
  verbiage: AnyObject;
  [key: string]: any;
}
