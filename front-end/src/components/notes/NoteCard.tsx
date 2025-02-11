// src/components/notes/NoteCard.tsx
import { Note } from "@/types/note";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NoteCardProps {
  note: Note;
  onDelete?: (noteId: string) => Promise<void>;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="whitespace-pre-wrap">{note.content}</div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <time>
            {formatDistanceToNow(new Date(note.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </time>

          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(note.id)}
            >
              Excluir
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
