"use client";

import { useState, useEffect } from "react";

type NewTask = {
  title: string;
  description: string;
  priority: "baixa" | "media" | "alta";
  date: string; // yyyy-mm-dd
};

type TaskForEdit = {
  id: string;
  title: string;
  description: string;
  priority: "baixa" | "media" | "alta";
  date: string;
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: NewTask) => void;
  initialTask?: TaskForEdit | null; 
};

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialTask,
}: TaskModalProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [date, setDate] = useState(initialTask?.date || "");
  const [priority, setPriority] = useState<NewTask["priority"]>(
    initialTask?.priority || "media"
  );

  // quando abrir o modal ou trocar a tarefa a editar, sincroniza os campos
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setDate(initialTask.date);
      setPriority(initialTask.priority);
    } else {
      setTitle("");
      setDescription("");
      setDate("");
      setPriority("media");
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    if (!title.trim()) {
      alert("Digite um título para a tarefa!");
      return;
    }
    if (!date) {
      alert("Selecione uma data!");
      return;
    }
    if (date < formattedDate) {
      alert("Você não pode selecionar uma data anterior a hoje!");
      return;
    }

    // Envia apenas os campos editáveis; o pai decide id/done/merge
    onSave({ title, description, date, priority });

    // limpa e fecha
    setTitle("");
    setDescription("");
    setPriority("media");
    setDate("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("media");
    setDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={handleClose}>
      <div
        className="w-full max-w-md rounded-xl border border-green-500/40 bg-gray-900 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-green-400">
          {initialTask ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>

        <label className="mb-3 block">
          <span className="text-sm text-green-300">Título</span>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-green-500/40 bg-black/70 p-2 text-green-200 outline-none focus:ring-2 focus:ring-green-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título..."
          />
        </label>

        <label className="mb-3 block">
          <span className="text-sm text-green-300">Descrição</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-green-500/40 bg-black/70 p-2 text-green-200 outline-none focus:ring-2 focus:ring-green-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhe sua tarefa..."
            rows={4}
          />
        </label>

        <div className="mb-3 flex gap-3">
          <label className="flex-1">
            <span className="text-sm text-green-300">Data</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-green-500/40 bg-black/70 p-2 text-green-200 outline-none focus:ring-2 focus:ring-green-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="flex-1">
            <span className="text-sm text-green-300">Prioridade</span>
            <select
              className="mt-1 w-full rounded-lg border border-green-500/40 bg-black/70 p-2 text-green-200 outline-none focus:ring-2 focus:ring-green-400"
              value={priority}
              onChange={(e) => setPriority(e.target.value as NewTask["priority"])}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-lg bg-gray-700 px-4 py-2 text-green-300 transition hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-green-600 px-4 py-2 font-bold text-black shadow-[0_0_10px_#00ff88] transition hover:bg-green-400"
          >
            {initialTask ? "Salvar Alterações" : "Adicionar Tarefa"}
          </button>
        </div>
      </div>
    </div>
  );
}
