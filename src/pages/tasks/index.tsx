import { useState, useEffect } from 'react';

// 1. Definice datového typu pro TypeScript
interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export default function TasksPage() {
  // 2. Lokální stav (State) pro uložení úkolů
  const [tasks, setTasks] = useState<Task[]>([]);

  // 3. Efekt (Side-effect) pro stažení dat z našeho API
  useEffect(() => {
    // Asynchronní HTTP GET požadavek na náš backend
    fetch('/api/tasks')
      .then((response) => response.json()) // Převod HTTP odpovědi na JSON
      .then((data) => setTasks(data));     // Uložení dat do lokálního stavu
  }, []); // Prázdné pole závislostí = spustí se pouze při prvním načtení komponenty (Mount)

  // 4. Vykreslení (Render) uživatelského rozhraní
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Můj Todolist</h1>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {/* Průchod polem úkolů a jejich vykreslení */}
        {tasks.map((task) => (
          <li 
            key={task.id} 
            style={{ 
              padding: '15px', 
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {/* Pokud je úkol hotový (completed: true), text se přeškrtne */}
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'gray' : 'black' }}>
              {task.name}
            </span>
            <span>{task.completed ? '✅' : '❌'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}