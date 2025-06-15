import React, { useRef, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { debouncer } from "@/utils/debouncer";
import Starterkit from "@tiptap/starter-kit";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { Button } from "@headlessui/react";

const Card = ({
  id,
  note,
  editorRef = null,
}: {
  id: number;
  note: string;
  editorRef?: {current: Editor | null } | null
}) => {
  const deleteNoteMutation = trpc.notes.deleteNote.useMutation();
  const updateNoteMutation = trpc.notes.updateNote.useMutation();
  const createNoteMutation = trpc.notes.createNote.useMutation();

  const utils = trpc.useUtils();

  const updateNoteHandler = (json: string) => {
    if (!id) {
      createNoteMutation.mutate({
        note: JSON.stringify(json),
      });
    } else {
      updateNoteMutation.mutate({
        id: id,
        note: JSON.stringify(json),
      });
    }

    utils.notes.getAllNotes.invalidate().then(() => {
      utils.notes.getAllNotes.refetch();
    });
  };

  const debouncedSaveNote = useRef(
    debouncer((json) => updateNoteHandler(json))
  ).current;

  const editor = useEditor({
    extensions: [Starterkit],
    content: note == "" || typeof note === "object" ? note : JSON.parse(note),
    editable: true,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      debouncedSaveNote(json);
    },
  });

  useEffect(() => {
    if (editorRef) {
      //@ts-ignore
      editorRef.current = editor;
    }
  }, [editor]);

  const deleteNoteHandler = () => {
    deleteNoteMutation.mutate({
      id: id,
    });
    utils.notes.getAllNotes.invalidate().then(() => {
      utils.notes.getAllNotes.refetch();
    });
  };

  return (
    <div className="p-2 m-2 border-1 border-gray-300 rounded-sm w-[80%] min-h-[60]">
      <Button
        className="text-xs font-bold bg-light-red border-1 border-gray-300 rounded-sm my-2 py-1 px-2 text-red-300"
        onClick={deleteNoteHandler}
      >
        X
      </Button>
      <EditorContent
        className="border-1 border-gray-300 rounded-sm w-full p-2 my-2 prose"
        editor={editor}
      />
    </div>
  );
};

export { Card };
