import {vi, Mocked, Mock, expect} from "vitest";
import { notesRouter } from "@/server/api/routes/notes";
import { PrismaClient } from "@prisma/client";

vi.mock("@prisma/client", () => {
  const mPrisma = {
    notes: {
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

describe("notesRouter", () => {
  let prisma: Mocked<PrismaClient>;

  beforeEach(() => {
    prisma = new PrismaClient() as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createNote", () => {
    it("should create a note and return it", async () => {
      const createdNote = { id: 1, note: "Test note" };
      (prisma.notes.create as Mock).mockResolvedValue(createdNote);
      const caller = notesRouter.createCaller({ prisma });
      const result = await caller.createNote({ note: "test note" });

      expect(prisma.notes.create).toHaveBeenCalledWith({
        data: { note: "test note" },
      });
      expect(result).toEqual(createdNote);
    });

    it("should throw if note is not a string", async () => {
      const caller = notesRouter.createCaller({ prisma });

      try {
        //@ts-ignore
        await caller.createNote({ note: 111 });
      } catch (error: any) {
        expect(error).toHaveProperty("message");
        expect(error.message).toContain("Expected string, received number");
      }
    });
  });
  describe("deleteNote", () => {
    it("should delete a note", async () => {
      (prisma.notes.delete as Mock).mockResolvedValue({
        id: 1,
        note: "",
      });
      const caller = notesRouter.createCaller({ prisma });
      const result = await caller.deleteNote({ id: 1 });

      expect(prisma.notes.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({
        id: 1,
        note: "",
      });
    });
  });
  describe("getAllNotes", () => {
    it("should get a list of notes", async () => {
      (prisma.notes.findMany as Mock).mockResolvedValue([
        { id: 1, note: "test note" },
        { id: 2, note: "test note" },
      ]);
      const caller = notesRouter.createCaller({ prisma });
      const result = await caller.getAllNotes();
      expect(prisma.notes.findMany).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, note: "test note" },
        { id: 2, note: "test note" },
      ]);
    });
  });
});
