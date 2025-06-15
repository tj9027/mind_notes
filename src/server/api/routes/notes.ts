import z from "zod";
import { procedure, router } from "../trpc";

const notesRouter = router({
  getAllNotes: procedure.query(async ({ ctx }) => {
    const notes = await ctx.prisma.notes.findMany({
      select: {
        id: true,
        note: true,
      },
    });

    return notes;
  }),
  createNote: procedure
    .input(
      z.object({
        note: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.prisma.notes.create({
        data: { note: input.note },
      });
      return created;
    }),
  deleteNote: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.prisma.notes.delete({
        where: {
          id: input.id,
        },
      });
      return deleted;
    }),
  updateNote: procedure
    .input(
      z.object({
        id: z.number(),
        note: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.prisma.notes.update({
        where: {
          id: input.id,
        },
        data: {
          note: input.note,
        },
      });
      return updated;
    }),
});
export { notesRouter };
