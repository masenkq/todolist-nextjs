import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

const dataPath = path.join(process.cwd(), 'data', 'tasks.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Získání dynamického parametru ID z URL adresy (např. z /api/tasks/3 bude id = 3)
  const { id } = req.query;

  // Zpracování metody PUT (Úprava existujícího úkolu - odškrtnutí/zrušení odškrtnutí)
  if (req.method === 'PUT') {
    try {
      const { completed } = req.body;

      const fileContents = await fs.readFile(dataPath, 'utf8');
      const tasks = JSON.parse(fileContents);
      
      // Najdeme index úkolu v poli, který chceme upravit
      const taskIndex = tasks.findIndex((t: { id: number }) => t.id === Number(id));

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Úkol nenalezen" });
      }

      // Aktualizace stavu 'completed' u nalezeného úkolu
      tasks[taskIndex].completed = completed;

      // Zápis aktualizovaných dat zpět do souboru
      await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
      
      res.status(200).json(tasks[taskIndex]);
    } catch (error) {
      res.status(500).json({ error: "Chyba při úpravě úkolu" });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Metoda ${req.method} není povolena`);
  }
}