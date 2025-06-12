import { procedure, router } from "./trpc";
import { notesRouter } from "./routes/notes";

const appRouter = router({
  notes: notesRouter,
  health: router({
    status: procedure.query(()=> "OK"),
  }),
});

export type AppRouter = typeof appRouter;
export { appRouter };
