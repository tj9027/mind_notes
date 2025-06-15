import React from "react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { Card } from "@/pages/components/Card";
import { Editor } from "@tiptap/core";

const { mutateMock, invalidateMock, refetchMock, updateMock } = vi.hoisted(
  () => ({
    mutateMock: vi.fn(),
    updateMock: vi.fn(),
    invalidateMock: vi.fn().mockResolvedValue(undefined),
    refetchMock: vi.fn(),
  })
);

vi.mock("@/utils/trpc", () => ({
  trpc: {
    notes: {
      deleteNote: {
        useMutation: () => ({
          mutate: mutateMock,
        }),
      },
      createNote: {
        useMutation: () => ({
          mutate: mutateMock,
        }),
      },
      updateNote: {
        useMutation: () => ({
          mutate: updateMock,
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
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders note text", () => {
    const note = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Test note" }],
        },
      ],
    };
    render(<Card id={1} note={JSON.stringify(note)} />);
    expect(screen.getByText("Test note")).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("calls deleteNote.mutate and utils methods on delete", async () => {
    const note = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Delete me" }],
        },
      ],
    };
    render(<Card id={42} note={JSON.stringify(note)} />);
    const deleteButton = screen.getByText("X");
    fireEvent.click(deleteButton);

    expect(mutateMock).toHaveBeenCalledWith({ id: 42 });
    await invalidateMock();
    expect(invalidateMock).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });

  it("should update note and save automatically", async () => {
    const note = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Update this note" }],
        },
      ],
    };

    const editorRef: { current: Editor | null } = { current: null };

    render(<Card id={3} note={JSON.stringify(note)} editorRef={editorRef} />);

    await act(async () => {
      while (!editorRef.current) {
        await new Promise(() =>
          setTimeout(() => {
            return;
          }, 50)
        );
      }
      editorRef.current?.commands.insertContent("Updated123");
    });

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText(/Updated123/i)).toBeInTheDocument();
    expect(updateMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalledWith({
      id: 3,
      note: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Updated123Update this note" }],
          },
        ],
      }),
    });
  });
});
