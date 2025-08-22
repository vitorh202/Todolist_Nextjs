"use client";

import { useState } from "react";
import "@/styles/input-styles.css";
import TaskModal from "@/components/TaskModal";

// Modelo de tarefa
type Task = {
  title: string;
  description: string;
  priority: "baixa" | "media" | "alta";
  done: boolean;
  date: string; // formato yyyy-mm-dd
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (task: Omit<Task, "done">) => {
    setTasks([...tasks, { ...task, done: false }]);
  };

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 text-green-200 font-mono">
      {/* AppBar */}
      <header className="w-full bg-black/90 border-b border-green-500/40 p-4 shadow-[0_0_15px_#00ff88] fixed top-0 left-0">
        <div className="flex items-center">
          <div className="flex-1"></div>
          <h1 className="text-2xl font-bold text-green-400">
            🖥️ Lista de Tarefas
          </h1>
          <p className="font-bold text-white-400 flex-1 text-right">
            Estilo:
            <select className="bg-black ml-2">
              <option value="Terminal">Terminal</option>
            </select>
          </p>
        </div>
      </header>

      {/* Main */}
      <div className="pt-20 flex flex-col items-center px-4 min-h-screen items-center justify-center">
        {/* BOTÃO abrir modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 bg-green-600 text-black px-6 py-2 rounded-lg font-bold hover:bg-green-400 transition shadow-[0_0_10px_#00ff88]"
        >
          + Nova Tarefa
        </button>

        {/* Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={addTask}
        />

        {/* HOJE */}
        <div className="w-full max-w-2xl bg-black/70 border border-green-500/30 rounded-2xl p-6 mb-10 shadow-[0_0_15px_#00ff88]">
          <h2 className="text-xl text-green-400 font-bold mb-4">
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
                  stroke="#00ff88"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 35}
                  strokeDashoffset={2 * Math.PI * 35 * (1 - progress / 100)}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-green-400 text-sm font-bold">
                {completedToday}/{todayTasks.length}
              </span>
            </div>
            <p className="text-green-300">
              Progresso de hoje:{" "}
              <span className="font-bold">{Math.round(progress)}%</span>
            </p>
          </div>

          {/* Lista HOJE */}
          <ul className="space-y-3">

          {todayTasks.map((t) => {
            const key = `${t.date}|${t.title}`; // chave única

            return (
              <li
                key={key}
                className="bg-black/60 p-3 rounded-lg border border-green-500/40 hover:shadow-[0_0_10px_#00ff88]"
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
                    className="accent-green-500 w-4 h-4 mr-2"
                  />

                  {/* Título */}
                  <div
                    className="flex-1 flex items-center cursor-pointer select-none"
                    onClick={() => toggleExpand(key)}
                  >
                    <span className={t.done ? "line-through text-green-600" : ""}>
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

                {/* Detalhes expandíveis */}
                {expandedTaskKey === key && (
                  <div className="mt-2 p-3 border-t border-green-500/20 text-green-300">
                    <p className="mb-1">{t.description || "Sem descrição"}</p>
                  </div>
                )}
              </li>
            );
          })}


            {todayTasks.length === 0 && (
              <p className="text-center text-green-700 italic">
                Nenhuma tarefa para hoje 🎉
              </p>
            )}
          </ul>
        </div>

        {/* FUTURO */}
        <div className="w-full max-w-2xl bg-black/70 border border-green-500/30 rounded-2xl p-6 shadow-[0_0_15px_#00ff88]">
          <h2 className="text-xl text-green-400 font-bold mb-4">
            📆 Tarefas Futuras
          </h2>
          {futureTasks.length === 0 && (
            <p className="text-center text-green-700 italic">
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
              <h3 className="text-green-300 mb-2">
                📅 {formatDateForDisplay(date)}
              </h3>
              <ul className="space-y-2">
                {group.map((t, i) => {
                  const taskKey = `${date}-${i}`;
                  return (
                    <li
                      key={taskKey}
                      className="bg-black/60 p-3 rounded-lg border border-green-500/40 hover:shadow-[0_0_10px_#00ff88]"
                    >
                      <div className="flex items-center justify-between">
                      <div
                    className="flex-1 flex items-center cursor-pointer select-none"
                    onClick={() => toggleExpand(taskKey)}
                  >
                    <span className={t.done ? "line-through text-green-600" : ""}>
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

                        <button
                          onClick={() => setTasks(tasks.filter((x) => x !== t))}
                          className="text-red-400 hover:text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Expansão */}
                      {expandedTaskKey === taskKey && (
                        <div className="mt-3 p-3 bg-black/40 rounded-lg border border-green-500/20">
                          <p className="text-green-200 text-sm">
                            {t.description || "Sem descrição"}
                          </p>
                          <p className="text-green-400 text-xs mt-2">
                            Prioridade:{" "}
                            <span
                              className={
                                t.priority === "alta"
                                  ? "text-red-400"
                                  : t.priority === "media"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }
                            >
                              {t.priority}
                            </span>
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
