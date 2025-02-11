// src/components/notes/NotesSection.tsx
import { CreateNoteData, Note } from "@/types/note";
import { NoteForm } from "./NoteForm";
import { NoteList } from "./NoteList";

interface NotesSectionProps {
  notes: Note[];
  clientId?: string;
  dealId?: string;
  isLoading: boolean;
  // Alterando o tipo para aceitar o retorno da mutação
  onCreateNote: (data: CreateNoteData) => Promise<Note | void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export function NotesSection({
  notes,
  clientId,
  dealId,
  isLoading,
  onCreateNote,
  onDeleteNote,
}: NotesSectionProps) {
  const handleSubmit = async ({ content }: { content: string }) => {
    await onCreateNote({
      content,
      clientId,
      dealId,
    });
  };

  return (
    <div className="space-y-6">
      <NoteForm onSubmit={handleSubmit} isLoading={isLoading} />

      <div className="border-t pt-6">
        <NoteList notes={notes} onDelete={onDeleteNote} />
      </div>
    </div>
  );
}
