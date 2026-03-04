import { useState, useEffect } from 'react';

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");

  const fetchTasks = () => {
    fetch('/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Funkce pro odeslání nového úkolu (HTTP POST)
  const addTask = async () => {
    // Zabráníme odeslání prázdného řetězce
    if (!newTaskName.trim()) return;

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTaskName }),
    });

    if (response.ok) {
      setNewTaskName(""); // Vyčištění textového pole
      fetchTasks(); // Aktualizace výpisu úkolů
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Můj Todolist</h1>
      
      {/* Formulář pro přidání úkolu */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Zadejte nový úkol..."
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Přidat úkol
        </button>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
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