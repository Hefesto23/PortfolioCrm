// src/components/notes/NoteList.tsx
import { Note } from "@/types/note";
import { NoteCard } from "./NoteCard";

interface NoteListProps {
  notes: Note[];
  onDelete?: (noteId: string) => Promise<void>;
}

export function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhuma nota encontrada
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
}
