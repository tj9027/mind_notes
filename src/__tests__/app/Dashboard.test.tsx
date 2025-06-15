import React from "react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "@/pages/components/Dashboard";

vi.mock("@/pages/components/Card", () => ({
  Card: ({ id, note }: { id: number; note: string }) => (
    <div data-testid={`card-${id}`}>{note}</div>
  ),
}));

const { mockUseQuery, mutateMock, invalidateMock, refetchMock } = vi.hoisted(
  () => ({
    mockUseQuery: vi.fn(),
    mutateMock: vi.fn(),
    refetchMock: vi.fn(),
    invalidateMock: vi.fn().mockResolvedValue(undefined),
  })
);

vi.mock("@/utils/trpc", () => ({
  trpc: {
    health: {
      status: { useQuery: () => ({ data: "ok" }) },
    },
    notes: {
      getAllNotes: { useQuery: mockUseQuery },
      createNote: { useMutation: () => ({ mutate: mutateMock }) },
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

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders notes when notesQuery returns data", () => {
    mockUseQuery.mockReturnValue({
      data: [
        {
          id: 1,
          note: "note 1",
        },
        {
          id: 2,
          note: "note 2",
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<Dashboard />);
    expect(screen.getByText("note 1")).toBeInTheDocument();
    expect(screen.getByText("note 2")).toBeInTheDocument();
  });

  it("should render Add button", () => {
    render(<Dashboard />);
    expect(screen.getByRole("button", { name: /Add Note/i }));
  });

  it("should call createNote on click", () => {
    render(<Dashboard />);
    screen.getByRole("button", { name: /Add Note/i }).click();
    expect(mutateMock).toHaveBeenCalled();
  });

  it("shows fallback when no notes and not loading", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<Dashboard />);
    expect(
      screen.getByText(/No notes available or error/i)
    ).toBeInTheDocument();
  });

  it("shows fallback when error", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: "Something went wrong" },
    });

    render(<Dashboard />);
    expect(
      screen.getByText(/No notes available or error/i)
    ).toBeInTheDocument();
  });

  it("does not render notes while loading", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<Dashboard />);
    expect(
      screen.getByText(/No notes available or error/i)
    ).toBeInTheDocument();
  });
});
