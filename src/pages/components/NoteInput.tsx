import React from "react";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

const NoteInput = () => {
  const [newNote, setNewNote] = useState<string | undefined>(undefined);
  const noteMutation = trpc.notes.createNote.useMutation();
  const utils = trpc.useUtils();

  const createNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote && newNote.length > 0) {
      noteMutation.mutate(
        {
          note: newNote,
        },
        {
          onSuccess: console.log,
          onError: console.log,
        }
      );
    }
    utils.notes.invalidate().then(() => {
      utils.notes.getAllNotes.refetch();
    });
    setNewNote("");
  };
  return (
    <div className="min-h-[20%] fixed b-0 border-t-1 rounded-t-lg w-full flex flex-col justify-start items-center">
      <h4>Add new Note:</h4>
      <form
        className="w-full flex items-center justify-evenly"
        onSubmit={createNote}
      >
        <textarea
          name="input-area"
          id="area1"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter note here..."
          className="min-h-20 min-w-[50%] border-1 rounded-sm"
        ></textarea>
        <button type="submit" className="w-[60] border-1 rounded-sm">
          Add
        </button>
      </form>
    </div>
  );
};

export { NoteInput };
