import React from "react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "@/pages/components/Dashboard";

vi.mock("@/pages/components/NoteInput", () => ({
  NoteInput: () => <div data-testid="note-input" />,
}));
vi.mock("@/pages/components/Card", () => ({
  Card: ({ id, note }: { id: number; note: string }) => (
    <div data-testid={`card-${id}`}>{note}</div>
  ),
}));

const {mockUseQuery} = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));
vi.mock("@/utils/trpc", () => ({
  trpc: {
    health: {
      status: { useQuery: () => ({ data: "ok" }) },
    },
    notes: {
      getAllNotes: { useQuery: mockUseQuery },
    },
  },
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders notes when notesQuery returns data", () => {
    mockUseQuery.mockReturnValue({
      data: [
        { id: 1, note: "First note" },
        { id: 2, note: "Second note" },
      ],
      isLoading: false,
      error: null,
    });

    render(<Dashboard />);
    expect(screen.getByText("First note")).toBeInTheDocument();
    expect(screen.getByText("Second note")).toBeInTheDocument();
    expect(screen.getByTestId("note-input")).toBeInTheDocument();
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
