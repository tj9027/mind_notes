import React from "react";
import { trpc } from "@/utils/trpc";

const Card = ({ id, note }: { id: number; note: string }) => {
  const deleteNoteMutation = trpc.notes.deleteNote.useMutation();
  const utils = trpc.useUtils();
  const deleteNoteHandler = () => {
    deleteNoteMutation.mutate({
      id: id,
    });
    utils.notes.getAllNotes.invalidate().then(()=> {
        utils.notes.getAllNotes.refetch()
    })
  };
  return (
    <div className="p-2 m-2 border-1 rounded-sm w-[80%] min-h-[60]">
      <button className="bg-light-red border-1 rounded-sm m-y-2 p-1" 
      onClick={deleteNoteHandler}>Delete</button>
      <p className="m-4">{note}</p>
    </div>
  );
};

export { Card };
