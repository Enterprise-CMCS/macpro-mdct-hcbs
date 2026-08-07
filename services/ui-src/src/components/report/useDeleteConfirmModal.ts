import { useRef } from "react";
import { useStore } from "utils";
import { QipDeleteModal } from "./QipDeleteModal";

interface Options<T> {
  items: T[];
  getId: (item: T) => string;
  getBody: (item: T) => string;
  confirmLabel: string;
  header: string;
  onConfirm: (remainingItems: T[], deletedId: string) => void;
}

export function useDeleteConfirmModal<T>({
  items,
  getId,
  getBody,
  confirmLabel,
  header,
  onConfirm,
}: Options<T>) {
  const { setModalComponent, setModalOpen, setModalFinalFocusRef } = useStore();
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const finalFocusRef = useRef<HTMLElement | null>(null);

  const getDeleteButtonRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) deleteButtonRefs.current.set(id, el);
    else deleteButtonRefs.current.delete(id);
  };

  const openDeleteModal = (id: string) => {
    const item = items.find((i) => getId(i) === id);
    const deletedIndex = items.findIndex((i) => getId(i) === id);
    if (deletedIndex === -1) return;
    const remainingItems = items.filter((i) => getId(i) !== id);
    const nextFocusId =
      remainingItems.length > 0
        ? getId(
            remainingItems[Math.min(deletedIndex, remainingItems.length - 1)]
          )
        : null;

    const close = () => setModalOpen(false);
    const confirm = () => {
      finalFocusRef.current = nextFocusId
        ? (deleteButtonRefs.current.get(nextFocusId) ?? addButtonRef.current)
        : addButtonRef.current;
      onConfirm(remainingItems, id);
      setModalOpen(false);
    };

    setModalComponent(
      QipDeleteModal(item ? getBody(item) : "", confirmLabel, close, confirm),
      header
    );
    // Must come after setModalComponent, which resets modalFinalFocusRef to null
    finalFocusRef.current = deleteButtonRefs.current.get(id) ?? null;
    setModalFinalFocusRef(finalFocusRef);
  };

  return { addButtonRef, getDeleteButtonRef, openDeleteModal };
}
