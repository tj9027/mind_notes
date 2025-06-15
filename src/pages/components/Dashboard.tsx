import React from "react";
import { trpc } from "@/utils/trpc";
import { Card } from "./Card";
import { Button } from "@headlessui/react";

const Dashboard = () => {
  const health = trpc.health.status.useQuery();

  if (health.data) {
    console.log(health.data);
  }

  const notesQuery = trpc.notes.getAllNotes.useQuery();
  const createNoteMutation = trpc.notes.createNote.useMutation();
  const utils = trpc.useUtils();

  const createNote = () => {
    createNoteMutation.mutate({
      note: "",
    });
    utils.notes.getAllNotes.invalidate().then(() => {
      utils.notes.getAllNotes.refetch();
    });
  };

  if (notesQuery.error) {
    console.log(notesQuery.error);
  }

  return (
    <div className="w-full h-svh  border-1 border-gray-300 rounded-lg">
      <div className="flex flex-col h-[80%] justify-start items-center overflow-y-scroll w-full m-4">
        {notesQuery.data && !notesQuery.isLoading && !notesQuery.error ? (
          <div className="w-full">
            {notesQuery.data.map((note: { id: number; note: string }) => {
              return <Card key={note.id} id={note.id} note={note.note} />;
            })}
          </div>
        ) : (
          <div>No notes available or error.</div>
        )}
      </div>
      <Button className="border-1 border-gray-300 rounded-sm m-4 p-2" onClick={createNote}>
        Add Note
      </Button>
    </div>
  );
};

export { Dashboard };
