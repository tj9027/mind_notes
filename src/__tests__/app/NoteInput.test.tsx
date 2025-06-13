import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { NoteInput } from "@/pages/components/NoteInput";

const { mutateMock, invalidateMock, refetchMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  invalidateMock: vi.fn().mockResolvedValue(undefined),
  refetchMock: vi.fn(),
}));

vi.mock("@/utils/trpc", () => ({
  trpc: {
    notes: {
      createNote: {
        useMutation: () => ({
          mutate: mutateMock,
        }),
      },
    },
    useUtils: () => ({
      notes: {
        invalidate: invalidateMock,
        getAllNotes: {
          refetch: refetchMock,
        },
      },
    }),
  },
}));

describe("NoteInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea and button", () => {
    render(<NoteInput />);
    expect(screen.getByPlaceholderText(/enter note here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    console.log("here");
  });

  it("updates textarea value on change", () => {
    render(<NoteInput />);
    const textarea = screen.getByPlaceholderText(
      /enter note here/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Test note" } });
    expect(textarea.value).toBe("Test note");
  });

  it("calls mutate and utils on submit with valid note", async () => {
    render(<NoteInput />);
    const textarea = screen.getByPlaceholderText(/enter note here/i);
    const button = screen.getByRole("button", { name: /add/i });

    fireEvent.change(textarea, { target: { value: "My new note" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        { note: "My new note" },
        expect.any(Object)
      );
      expect(invalidateMock).toHaveBeenCalled();
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it("does not call mutate if note is empty", () => {
    render(<NoteInput />);
    const button = screen.getByRole("button", { name: /add/i });
    fireEvent.click(button);
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("clears textarea after submit", async () => {
    render(<NoteInput />);
    const textarea = screen.getByPlaceholderText(
      /enter note here/i
    ) as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /add/i });

    fireEvent.change(textarea, { target: { value: "Clear me" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(textarea.value).toBe("");
    });
  });
});
