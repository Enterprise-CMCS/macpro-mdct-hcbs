import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { PageElement } from "types";
import { useStore } from "utils";

export const useLiveElement = (elementId: string) => {
  const [liveElement, setLiveElement] = useState<PageElement | undefined>();
  const { report, pageMap, currentPageId } = useStore();

  if (!currentPageId) return;
  const currentPage = report?.pages[pageMap?.get(currentPageId)!];

  if (!currentPage || !currentPage.elements) return;
  const elementIndex = currentPage?.elements?.findIndex(
    (element) => element.id === elementId
  );
  const stateElement = currentPage?.elements[elementIndex];
  const hookFormElement = useWatch({ name: `elements.${elementIndex}` });

  useEffect(() => {
    setLiveElement({
      ...stateElement,
      ...hookFormElement,
    });
  }, [hookFormElement, stateElement]);

  return liveElement;
};
