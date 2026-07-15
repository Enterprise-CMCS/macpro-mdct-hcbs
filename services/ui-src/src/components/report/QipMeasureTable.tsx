import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Flex,
  Image,
  Link,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import {
  QipMeasureTableTemplate,
  QipReportShape,
  FormPageTemplate,
  HeaderTemplate,
  NestedHeadingTemplate,
  NumberFieldTemplate,
} from "types";
import {
  MeasureCreationParameters,
  QipMeasureSelectModal,
} from "./QipMeasureSelectModal";
import { useStore } from "utils";
import { PageElementProps } from "./Elements";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";
import addIcon from "assets/icons/add/icon_add_blue.svg";

export const QipMeasureTableElement = ({
  element: { caption, answer },
  disabled: _disabled,
  updateElement,
}: PageElementProps<QipMeasureTableTemplate>) => {
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();
  const { report, updateReport, setModalComponent, setModalOpen } = useStore();
  const measureTargetMapping = (report as unknown as QipReportShape)
    .measureTargetMapping;
  const { autosave } = useContext(ReportAutosaveContext);

  const addMeasureTargetPage = (params: MeasureCreationParameters) => {
    const { measureInfo, qmsReportId, deliveryMethods, rates } = params;
    // TODO: fetch QMS report, to get its values. And look them up.

    const pageId = cloneQipMeasureTemplatePage(
      report as unknown as QipReportShape, // TODO get rid of this cast.
      params
    );
    // Tell store to rebuild the pageMap, now that we have a new page
    updateReport(report);

    // TODO these property names are terrible.
    const newAnswer = [
      ...(answer ?? []),
      {
        pageId,
        measureId: measureInfo.value,
        sourceReportId: qmsReportId,
        // TODO: We probably don't need these in the table's answer. Do we?
        // But maybe it will be convenient down the road...
        deliveryMethods: deliveryMethods,
        rateIds: rates,
        // TODO: record values pulled from the QMS report, for later reference
        copiedValues: {},
      },
    ];
    updateElement({ answer: newAnswer });

    // TODO: We will already have autosaved due to updateElement... right?
    autosave();
    setModalOpen(false);
  };

  const modal = (
    <QipMeasureSelectModal
      measureTargetInfo={measureTargetMapping}
      onClose={() => setModalOpen(false)}
      onSubmit={addMeasureTargetPage}
    />
  );

  const rows = (answer ?? []).map((measure, index) => {
    const mapping = measureTargetMapping.find(
      (mtm) => mtm.value === measure.measureId
    );
    return (
      <Tr key={index}>
        <Td>{/* TODO: status icon */}</Td>
        <Td>
          {mapping.measureName}
          {/* TODO: CMIT number? */}
          {/* TODO: status text */}
          {/* TODO: error message? */}
        </Td>
        <Td>
          <Flex gap="spacer2" sx={sx.flex}>
            {/* TODO: We don't need this href, right? If not, remove from QMS Measure Table too. */}
            <Button
              as={Link}
              variant={"outline"}
              aria-label={`Edit ${mapping.measureName}`}
              href={`/report/${reportType}/${state}/${reportId}/${measure.pageId}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(
                  `/report/${reportType}/${state}/${reportId}/${measure.pageId}`
                );
              }}
            >
              Edit
            </Button>
            {/* TODO delete button */}
          </Flex>
        </Td>
      </Tr>
    );
  });

  return (
    <>
      <Button
        onClick={() => setModalComponent(modal, "Add Measure")}
        variant={"outline"}
      >
        <Image src={addIcon} alt="" sx={{ padding: "3px" }} />
        Add measure
      </Button>
      <Table variant="measure">
        <TableCaption>
          <VisuallyHidden>{caption}</VisuallyHidden>
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Status</Th>
            <Th>Measure details</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {rows.length > 0 ? <Tbody>{rows}</Tbody> : null}
      </Table>
      {rows.length === 0
        ? "Keep track of your measures, once you add a report you can access it here."
        : null}
    </>
  );
};

const sx = {
  flex: {
    justifyContent: "flex-end",

    ".mobile &": {
      justifyContent: "flex-start",
    },
  },
};

export const cloneQipMeasureTemplatePage = (
  report: QipReportShape,
  params: MeasureCreationParameters
) => {
  const { measureInfo, deliveryMethods, rates } = params;
  const templatePage = report.pages.find(
    (p) => p.id === "measure-target-template"
  ) as FormPageTemplate;
  const page = structuredClone(templatePage);
  const mapping = report.measureTargetMapping.find(
    (mtm) => mtm.value === measureInfo.value
  )!;

  // Generate a unique page ID, ex: "target-LTSS-1-1"
  // TODO: This algorithm is not actually guaranteed to generate a unique ID.
  const pageIdPrefix = `target-${measureInfo.value}-`;
  const matchingPageCount = report.pages.filter((p) =>
    p.id.startsWith(pageIdPrefix)
  ).length;
  page.id = pageIdPrefix + matchingPageCount.toString();

  page.navTitle = page.navTitle!.replace("{measureName}", mapping.measureName);
  page.tabTitle = page.tabTitle!.replace("{measureName}", mapping.measureName);
  const header = page.elements.find(
    (e) => e.id === "page-header"
  ) as HeaderTemplate;
  header.text = header.text.replace("{measureName}", mapping.measureName);

  for (let section of ["baseline", "target"]) {
    for (let deliveryMethodId of deliveryMethods) {
      // TODO: Use the actual words. Maybe on the modal's checkboxes too??
      const deliveryMethodLabel = deliveryMethodId;
      const dmHeaderIndex = page.elements.findIndex(
        (e) => e.id === `${section}-{deliveryMethodId}-header`
      );
      console.assert(
        dmHeaderIndex > 0,
        "found elem with id " + `${section}-{deliveryMethodId}-header`
      );
      const dmHeaderElement = structuredClone(
        page.elements[dmHeaderIndex]
      ) as NestedHeadingTemplate;
      const dmRateElement = structuredClone(
        page.elements[dmHeaderIndex + 1]
      ) as NumberFieldTemplate;
      dmHeaderElement.id = dmHeaderElement.id.replace(
        "{deliveryMethodId}",
        deliveryMethodId
      );
      dmHeaderElement.text = dmHeaderElement.text.replace(
        "{deliveryMethodLabel}",
        deliveryMethodLabel
      );
      dmRateElement.id = dmRateElement.id.replace(
        "{deliveryMethodId}",
        deliveryMethodId
      );
      page.elements.splice(dmHeaderIndex, 0, dmHeaderElement, dmRateElement);

      for (let rateId of rates) {
        // TODO any cast!
        const rateLabel = mapping.rates.find(
          (r: any) => r.id === rateId
        )!.label;
        const rateIndex = page.elements.findIndex(
          (e) => e.id === `${section}-${deliveryMethodId}-{rateId}`
        );
        const rateElement = structuredClone(
          page.elements[rateIndex]
        ) as NumberFieldTemplate;
        rateElement.id = rateElement.id.replace("{rateId}", rateId);
        rateElement.label = rateElement.label.replace("{rateLabel}", rateLabel);
        page.elements.splice(rateIndex, 0, rateElement);
      }
      const rateIndex = page.elements.findIndex(
        (e) => e.id === `${section}-${deliveryMethodId}-{rateId}`
      );
      page.elements.splice(rateIndex, 1);
    }
    const headerTemplateIndex = page.elements.findIndex(
      (e) => e.id === `${section}-{deliveryMethodId}-header`
    );
    page.elements.splice(headerTemplateIndex, 2);
  }

  // Insert the new page just before Review & Submit
  const pageIndex = report.pages.findIndex((p) => p.id === "review-submit");
  report.pages.splice(pageIndex, 0, page);

  return page.id;
};
