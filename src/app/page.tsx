"use client";

import { useState } from "react";
import '@/styles/input-styles.css';

// Modelo de tarefa
type Task = {
  title: string;
  done: boolean;
  date: string; // formato yyyy-mm-dd
};

export default function Home() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (!task.trim()) {
      alert("Você deve adicionar um título para a tarefa");
      return;
    }

    if(!date) {
      alert("Selecione uma data");
      return;
    }

    setTasks([...tasks, { title: task, done: false, date }]);
    setTask("");
    setDate("");
  };


  const formatDateForDisplay = (inputDate: string) => {
    // Verifica se a data é válida antes de tentar formatar
    if (!inputDate) return '';
    
    // Divide a string da data em partes [ano, mês, dia]
    const [year, month, day] = inputDate.split('-');
    
    // Retorna a data no formato desejado
    return `${day}/${month}/${year}`;
  };

  // Data de hoje
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

  // verificar se a tarefa e atual ou futura. 
  const todayTasks = tasks.filter((t) => t.date === formattedDate);
  const futureTasks = tasks.filter((t) => t.date > formattedDate);

  const completedToday = todayTasks.filter((t) => t.done).length;
  const progress =
    todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 text-green-200 font-mono">
      {/* AppBar */}
      <header className="w-full bg-black/90 border-b border-green-500/40 p-4 shadow-[0_0_15px_#00ff88] fixed top-0 left-0">
        <div className="flex items-center">
          {/* Primeira coluna: Vazia, serve para alinhar o h1 */}
          <div className="flex-1"></div>

          {/* Segunda coluna: O h1 centralizado */}
          <h1 className="text-2xl font-bold text-green-400">
            🖥️ Lista de Tarefas
          </h1>

          {/* Terceira coluna: O p alinhado à direita */}
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
        <div className="w-full max-w-2xl bg-black/70 border border-green-500/30 rounded-2xl p-6 mb-10 shadow-[0_0_15px_#00ff88]">
          <h2 className="text-xl text-green-400 font-bold mb-4">
            📅 Tarefas de Hoje
          </h2>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Nova tarefa..."
              className="flex-1 rounded-lg bg-black/70 border border-green-500/40 text-green-300 placeholder-green-700 p-2 outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg bg-black/70 border border-green-500/40 text-green-300 p-2 outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={addTask}
              className="bg-green-600 text-black px-4 py-2 rounded-lg font-bold hover:bg-green-400 transition shadow-[0_0_10px_#00ff88]"
            >
              +
            </button>
          </div>

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
                  strokeDashoffset={
                    2 * Math.PI * 35 * (1 - progress / 100)
                  }
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
            {todayTasks.map((t, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-black/60 p-3 rounded-lg border border-green-500/40 hover:shadow-[0_0_10px_#00ff88]"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {
                      const newTasks = [...tasks];
                      newTasks[
                        tasks.findIndex((x) => x === t)
                      ].done = !t.done;
                      setTasks(newTasks);
                    }}
                    className="accent-green-500 w-4 h-4"
                  />
                  <span className={t.done ? "line-through text-green-600" : ""}>
                    {t.title}
                  </span>
                </label>
                <button
                  onClick={() =>
                    setTasks(tasks.filter((x) => x !== t))
                  }
                  className="text-red-400 hover:text-red-600 font-bold"
                >
                  ✕
                </button>
              </li>
            ))}
            {todayTasks.length === 0 && (
              <p className="text-center text-green-700 italic">
                Nenhuma tarefa para hoje 🎉
              </p>
            )}
          </ul>
        </div>

        {/* Lista FUTURO */}
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
              <h3 className="text-green-300 mb-2">📅 {formatDateForDisplay(date)}</h3>
              <ul className="space-y-2">
                {group.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-black/60 p-3 rounded-lg border border-green-500/40 hover:shadow-[0_0_10px_#00ff88]"
                  >
                    <span>{t.title}</span>
                    <button
                      onClick={() =>
                        setTasks(tasks.filter((x) => x !== t))
                      }
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}