import React from "react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card } from "@/pages/components/Card";

const { mutateMock, invalidateMock, refetchMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  invalidateMock: vi.fn().mockResolvedValue(undefined),
  refetchMock: vi.fn(),
}));

vi.mock("@/utils/trpc", () => ({
  trpc: {
    notes: {
      deleteNote: {
        useMutation: () => ({
          mutate: mutateMock,
        }),
      },
    },
    useUtils: () => ({
      notes: {
        getAllNotes: {
          invalidate: invalidateMock,
          refetch: refetchMock,
        },
      },
    }),
  },
}));

describe("Card", () => {
  beforeEach(() => {
    mutateMock.mockClear();
    invalidateMock.mockClear();
    refetchMock.mockClear();
  });

  it("renders note text", () => {
    render(<Card id={1} note="Test note" />);
    expect(screen.getByText("Test note")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls deleteNote.mutate and utils methods on delete", async () => {
    render(<Card id={42} note="Delete me" />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mutateMock).toHaveBeenCalledWith({ id: 42 });
    await invalidateMock();
    expect(invalidateMock).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });
});