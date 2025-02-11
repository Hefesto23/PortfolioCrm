// src/components/notes/NoteForm.tsx
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const noteSchema = z.object({
  content: z.string().min(1, "O conteúdo é obrigatório"),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => Promise<void>;
  isLoading: boolean;
}

export function NoteForm({ onSubmit, isLoading }: NoteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const handleFormSubmit = async (data: NoteFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <textarea
          {...register("content")}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
          placeholder="Digite sua anotação..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit" isLoading={isLoading}>
        Adicionar Nota
      </Button>
    </form>
  );
}
