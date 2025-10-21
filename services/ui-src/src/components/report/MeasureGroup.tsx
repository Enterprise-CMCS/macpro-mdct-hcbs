import {
  ElementType,
  MeasureGroupTemplate,
  NdrBasicTemplate,
  PageElement,
} from "types";
import { PageElementProps } from "./Elements";
import { Page } from "components/report/Page";
import { useStore } from "utils";
import { currentPageSelector } from "utils/state/selectors";
import { useEffect } from "react";

export const MeasureGroupElement = (
  props: PageElementProps<MeasureGroupTemplate>
) => {
  const { parent, elements } = props.element;
  const updateElement = props.updateElement;
  const currentPage = useStore(currentPageSelector);

  const parentElement = currentPage?.elements?.find(
    (element) => element.id === parent.id
  );

  const renderGroup = () => {
    switch (parent.type) {
      case ElementType.NdrBasic: {
        const template = parentElement as NdrBasicTemplate;

        //used to check if NDR Basic needs to display an explanation box for any particular value
        return (
          !template.answer?.rate ||
          !template.minPerformanceLevel ||
          template.answer?.rate < template.minPerformanceLevel
        );
      }
      default:
        return undefined;
    }
  };
  const render = renderGroup();

  const setChildren = (checkedChildren: PageElement[]) => {
    updateElement({ elements: [...checkedChildren] });
  };

  useEffect(() => {
    if (!render) {
      //if the group is not render, the answer needs to be cleared
      const clearElements = elements.map((element) => {
        if ("answer" in element) {
          element.answer = undefined;
        }
        return element;
      });
      updateElement({ elements: [...clearElements] });
    }
  }, [render]);

  return (
    <>
      {render && (
        <Page
          id="radio-children"
          setElements={setChildren}
          elements={elements}
        />
      )}
    </>
  );
};
