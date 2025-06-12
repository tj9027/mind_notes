import { trpc } from "@/utils/trpc";
import { NoteInput } from "./NoteInput";
import { Card } from "./Card";

const Dashboard = () => {
  const health = trpc.health.status.useQuery();
  if (health.data) {
    console.log(health.data);
  }
  const notesQuery = trpc.notes.getAllNotes.useQuery();
  if (notesQuery.error) {
    console.log(notesQuery.error);
  }
  return (
    <div className="w-full h-svh  border-1 rounded-lg">
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
      <NoteInput />
    </div>
  );
};

export { Dashboard };
