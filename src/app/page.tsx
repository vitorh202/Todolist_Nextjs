"use client";

import { useState, useEffect } from "react";
import TaskModal from "@/components/TaskModal";

// Modelo de tarefa
type Task = {
  id: string;
  title: string;
  description: string;
  priority: "baixa" | "media" | "alta";
  done: boolean;
  date: string; // formato yyyy-mm-dd
};

type Theme = "light" | "pink" | "dark" | "terminal";
const THEME_KEY = "theme";

const normalizeTheme = (v: string | null): Theme => {
  if (!v) return "light";
  const t = v.toLowerCase();
  if (t === "pink") return "pink";
  if (t === "dark") return "dark";
  if (t === "terminal") return "terminal";
  return "light";
};

export default function Home() {
  const [theme, setTheme] = useState<Theme>(() =>
  normalizeTheme(typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);



  const formatDateForDisplay = (inputDate: string) => {
    if (!inputDate) return "";
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };

  // Data de hoje
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // separar listas
  const todayTasks = tasks.filter((t) => t.date === formattedDate);
  const futureTasks = tasks.filter((t) => t.date > formattedDate);

  const completedToday = todayTasks.filter((t) => t.done).length;
  const progress =
    todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  // controle de expandir tarefas -> agora usa uma "chave única"
  const [expandedTaskKey, setExpandedTaskKey] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedTaskKey(expandedTaskKey === key ? null : key);
  };

    // Carregar do localStorage ao iniciar
    useEffect(() => {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        const parsed: Task[] = JSON.parse(stored) as Task[]; // <-- define o tipo
        const tasksWithDone: Task[] = parsed.map((t: Task) => ({
          ...t,
          done: t.done ?? false
        }));
        setTasks(tasksWithDone);
      }
    }, []);

    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    // Salvar no localStorage sempre que as tarefas mudarem
    useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

  return (
    <main className="min-h-screen bg-theme transition-colors duration-300 font-mono text-[var(--text-color)]">
      {/* AppBar */}
      <header className="w-full fixed top-0 left-0 header-theme p-2 z-30">
        <div className="flex items-center">
          <div className="flex-1"></div>
          <h1 className="text-2xl font-bold text-[var(--primary-color)]">🖥️ Lista de Tarefas</h1>
          <p className="font-bold text-white-400 flex-1 text-right">
            Estilo:
            <select className="ml-2 rounded px-2 py-1 bg-[var(--card-bg)] border" onChange={(e) => setTheme(normalizeTheme(e.target.value))} value={theme}>
              <option value="light">Light</option>
              <option value="pink">Pink</option>
              <option value="dark">Dark</option>
              <option value="terminal">Terminal</option>
            </select>
          </p>
        </div>
      </header>

      {/* Main */}
      <div className="pt-20 flex flex-col items-center px-4 min-h-screen items-center justify-center">
        {/* BOTÃO abrir modal */}
        <button
          onClick={() => setIsAdding(true)}
          className="mb-6 px-6 py-2 rounded-lg font-bold btn-theme"
        >
          + Nova Tarefa
        </button>

        {/* Modal */}
        <TaskModal
          isOpen={isAdding || !!editingTask}
          onClose={() => {
            setIsAdding(false);
            setEditingTask(null);
          }}
          initialTask={editingTask || undefined}
          onSave={(updated) => {
            if (editingTask) {
              // Edição
              setTasks(prev =>
                prev.map(task =>
                  task.id === editingTask.id ? { ...task, ...updated } : task
                )
              );
            } else {
              // Adição
              setTasks(prev => [
                ...prev,
                { ...updated, id: Date.now().toString(), done: false }
              ]);
            }
            setIsAdding(false);
            setEditingTask(null);
          }}
        />

        {/* HOJE */}
        <div className="w-full max-w-2xl border border-theme rounded-2xl p-6 mb-10 bg-card shadow-theme">
          <h2 className="text-xl text-[var(--primary-color)] font-bold mb-4">
            📅 Tarefas de Hoje
          </h2>

          {/* Progresso */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="gray"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="var(--primary-color)"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 35}
                  strokeDashoffset={2 * Math.PI * 35 * (1 - progress / 100)}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[var(--primary-color)] text-sm font-bold">
                {completedToday}/{todayTasks.length}
              </span>
            </div>
            <p className="text-[var(--primary-color)]">
              Progresso de hoje:{" "}
              <span className="font-bold">{Math.round(progress)}%</span>
            </p>
          </div>

          {/* Lista HOJE */}
          <ul className="space-y-3">

          {todayTasks.map((t) => {
            const key = `${t.date}|${t.title}`; 

            return (
              <li
              key={key}
                className="bg-[var(--bg-color)] p-3 rounded-lg border border-[var(--border)] hover:shadow-[0_0_10px_var(--shadow-color)]"
              >
                {/* Header da tarefa */}
                <div className="flex items-center justify-between">
                  {/* Checkbox separado */}
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {
                      const newTasks = tasks.map((task) =>
                        `${task.date}|${task.title}` === key
                          ? { ...task, done: !task.done }
                          : task
                      );
                      setTasks(newTasks);
                    }}
                    className="accent-[var(--border)] w-4 h-4 mr-2"
                  />

                  {/* Título */}
                  <div
                    className="flex-1 flex items-center cursor-pointer select-none"
                    onClick={() => toggleExpand(key)}
                  >
                    <span className={t.done ? "line-through text-[var(--primary-color)]" : ""}>
                      {t.title}
                    </span>

                    {/* Badge de prioridade */}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-lg font-bold ${
                        t.priority === "alta"
                          ? "bg-red-500/30 text-red-400"
                          : t.priority === "baixa"
                          ? "bg-blue-500/30 text-blue-400"
                          : "bg-yellow-500/30 text-yellow-400"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                  {/* Botão de editar */}
                  <button
                    onClick={() => setEditingTask(t)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    ✏️
                  </button>

                  {/* Botão excluir */}
                  <button
                    onClick={() => {
                      setTasks(tasks.filter((task) => `${task.date}|${task.title}` !== key));
                    }}
                    className="text-red-400 hover:text-red-600 font-bold ml-2"
                  >
                    ✕
                  </button>
                  </div>
                </div>

                {/* Detalhes expandíveis */}
                {expandedTaskKey === key && (
                  <div className="mt-2 p-3 border-t border-[var(--border)] text-[var(--text-color)]">
                    <p className="mb-1">{t.description || "Sem descrição"}</p>
                  </div>
                )}
              </li>
            );
          })}


            {todayTasks.length === 0 && (
              <p className="text-center text-[var(--primary-color)] italic">
                Nenhuma tarefa para hoje 🎉
              </p>
            )}
          </ul>
        </div>

        {/* FUTURO */}
        <div className="w-full max-w-2xl border border-theme rounded-2xl p-6 mb-10 bg-card shadow-theme">
          <h2 className="text-xl text-[var(--primary-color)] font-bold mb-4">
            📆 Tarefas Futuras
          </h2>
          {futureTasks.length === 0 && (
            <p className="text-center text-[var(--primary-color)] italic">
              Nenhuma tarefa futura definida...
            </p>
          )}
          {Object.entries(
            futureTasks.reduce<Record<string, Task[]>>((acc, t) => {
              if (!acc[t.date]) acc[t.date] = [];
              acc[t.date].push(t);
              return acc;
            }, {})
          ).map(([date, group]) => (
            <div key={date} className="mb-6">
              <h3 className="text-[var(--primary-color)] mb-2">
                📅 {formatDateForDisplay(date)}
              </h3>
              <ul className="space-y-2">
                {group.map((t, i) => {
                  const taskKey = `${date}-${i}`;
                  return (
                    <li
                      key={taskKey}
                      className="bg-[var(--bg-color)] p-3 rounded-lg border border-[var(--border)] hover:shadow-[0_0_10px_var(--shadow-color)]"
                    >
                      <div className="flex items-center justify-between">
                      <div
                    className="flex-1 flex items-center cursor-pointer select-none"
                    onClick={() => toggleExpand(taskKey)}
                  >
                    <span className={t.done ? "line-through text-[var(--primary-color)]" : ""}>
                      {t.title}
                    </span>

                    {/* Badge de prioridade */}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-lg font-bold ${
                        t.priority === "alta"
                          ? "bg-red-500/30 text-red-400"
                          : t.priority === "baixa"
                          ? "bg-blue-500/30 text-blue-400"
                          : "bg-yellow-500/30 text-yellow-400"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                        <div className="flex gap-2">
                        {/* Botão de editar */}
                        <button
                          onClick={() => setEditingTask(t)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setTasks(tasks.filter((x) => x !== t))}
                          className="text-red-400 hover:text-red-600 font-bold"
                        >
                          ✕
                        </button>
                        </div>
                      </div>

                      {/* Expansão */}
                      {expandedTaskKey === taskKey && (
                        <div className="mt-3 p-3 bg-black/40 rounded-lg border border-[var(--border)]">
                          <p className="text-[var(--text-color)] text-sm">
                            {t.description || "Sem descrição"}
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
