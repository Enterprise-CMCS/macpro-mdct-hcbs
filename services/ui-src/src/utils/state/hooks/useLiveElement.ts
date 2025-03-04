import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { PageElement } from "types";
import { useStore } from "utils";

/**
 * This hook gives the most up to date version of an element on the current page.
 * This solves two problems:
 *   - The react-hook-form hooks can init empty but they are always the most up to date after
 *   - The store only updates (in most instances) on blur
 * When we need elements to visually change immediately based on other elements, this bridges the divide
 * Useful for instances like the QM table display, but not for everything
 * @param elementId The id of the element on the current page to watch
 * @returns A page element or undefined
 */
export const useLiveElement = (elementId: string) => {
  const [liveElement, setLiveElement] = useState<PageElement | undefined>();
  const { report, pageMap, currentPageId } = useStore();

  if (!currentPageId) return;
  const currentPage = report?.pages[pageMap?.get(currentPageId)!];

  if (!currentPage || !currentPage.elements) return;
  const elementIndex = currentPage?.elements?.findIndex(
    (element) => element.id === elementId
  );

  // Get elements from both sources
  const stateElement = currentPage?.elements[elementIndex];
  const hookFormElement = useWatch({ name: `elements.${elementIndex}` });

  // Hook runs whenever either source updates, merge
  useEffect(() => {
    setLiveElement({
      ...stateElement,
      ...hookFormElement,
    });
  }, [hookFormElement, stateElement]);

  return liveElement;
};
