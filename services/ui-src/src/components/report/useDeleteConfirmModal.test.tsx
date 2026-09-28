import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeleteConfirmModal } from "./useDeleteConfirmModal";
import { QipDeleteModal } from "./QipDeleteModal";
import { useStore } from "utils";

let mockQipOnClose: () => void;
let mockQipOnConfirm: () => void;
let mockQipBody: string;

vi.mock("./QipDeleteModal", () => ({
  QipDeleteModal: (
    ...[_body, _confirmLabel, onClose, onConfirm]: Parameters<
      typeof QipDeleteModal
    >
  ) => {
    mockQipBody = _body;
    mockQipOnClose = onClose;
    mockQipOnConfirm = onConfirm;
    return "mock-modal";
  },
}));

vi.mock("utils/state/useStore", () => ({
  useStore: vi.fn(),
}));
const mockedUseStore = vi.mocked(useStore);

const items = [
  { id: "item-1", label: "Item 1" },
  { id: "item-2", label: "Item 2" },
  { id: "item-3", label: "Item 3" },
];

describe("useDeleteConfirmModal", () => {
  const mockSetModalComponent = vi.fn();
  const mockSetModalOpen = vi.fn();
  const mockSetModalFinalFocusRef = vi.fn();
  const mockOnConfirm = vi.fn();

  const defaultOptions = {
    items,
    getId: (item: (typeof items)[0]) => item.id,
    getBody: (item: (typeof items)[0]) => `Delete ${item.label}?`,
    confirmLabel: "Remove item",
    header: "Are you sure?",
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStore.mockReturnValue({
      setModalComponent: mockSetModalComponent,
      setModalOpen: mockSetModalOpen,
      setModalFinalFocusRef: mockSetModalFinalFocusRef,
    });
  });

  it("should call setModalComponent and setModalFinalFocusRef when opening modal", () => {
    const { result } = renderHook(() => useDeleteConfirmModal(defaultOptions));

    act(() => result.current.openDeleteModal("item-1"));

    expect(mockSetModalComponent).toHaveBeenCalledWith(
      expect.anything(),
      "Are you sure?"
    );
    expect(mockSetModalFinalFocusRef).toHaveBeenCalled();
  });

  it("should pass getBody result to QipDeleteModal", () => {
    const { result } = renderHook(() => useDeleteConfirmModal(defaultOptions));

    act(() => result.current.openDeleteModal("item-2"));

    expect(mockQipBody).toBe("Delete Item 2?");
  });

  it("should not open modal for an unknown id", () => {
    const { result } = renderHook(() => useDeleteConfirmModal(defaultOptions));

    act(() => result.current.openDeleteModal("unknown-id"));

    expect(mockSetModalComponent).not.toHaveBeenCalled();
  });

  it("should call setModalOpen(false) when onClose is triggered", () => {
    const { result } = renderHook(() => useDeleteConfirmModal(defaultOptions));

    act(() => result.current.openDeleteModal("item-1"));
    act(() => mockQipOnClose());

    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("should call onConfirm with remaining items and id when confirmed", async () => {
    const { result } = renderHook(() => useDeleteConfirmModal(defaultOptions));

    act(() => result.current.openDeleteModal("item-1"));
    await act(async () => mockQipOnConfirm());

    expect(mockOnConfirm).toHaveBeenCalledWith(
      [
        { id: "item-2", label: "Item 2" },
        { id: "item-3", label: "Item 3" },
      ],
      "item-1"
    );
  });

  it("should call setModalOpen(false) after confirming", async () => {
    const { result } = renderHook(() => useDeleteConfirmModal(defaultOptions));

    act(() => result.current.openDeleteModal("item-1"));
    await act(async () => mockQipOnConfirm());

    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("should focus next delete button after confirming a non-last item", async () => {
    const { result } = renderHook(() => useDeleteConfirmModal(defaultOptions));

    // Register refs for item-2 and item-3
    const item2Button = document.createElement("button");
    const item3Button = document.createElement("button");
    result.current.getDeleteButtonRef("item-2")(item2Button);
    result.current.getDeleteButtonRef("item-3")(item3Button);

    act(() => result.current.openDeleteModal("item-2"));
    await act(async () => mockQipOnConfirm());

    // After confirming item-2 (index 1), next focus is item-3 (same index in remaining)
    const focusRefArg = mockSetModalFinalFocusRef.mock.calls[0][0];
    expect(focusRefArg.current).toBe(item3Button);
  });

  it("should fall back to addButtonRef when deleting the last item", async () => {
    const singleItemOptions = {
      ...defaultOptions,
      items: [{ id: "item-1", label: "Item 1" }],
    };
    const { result } = renderHook(() =>
      useDeleteConfirmModal(singleItemOptions)
    );

    const addButton = document.createElement("button");
    result.current.addButtonRef.current = addButton;

    act(() => result.current.openDeleteModal("item-1"));
    await act(async () => mockQipOnConfirm());

    const focusRefArg = mockSetModalFinalFocusRef.mock.calls[0][0];
    expect(focusRefArg.current).toBe(addButton);
  });
});
