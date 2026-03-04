import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

// Definuje absolutní cestu k souboru tasks.json v kořenovém adresáři
const dataPath = path.join(process.cwd(), 'data', 'tasks.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Zpracování HTTP metody GET
  if (req.method === 'GET') {
    try {
      // timhle cteme soubor
      const fileContents = await fs.readFile(dataPath, 'utf8');
      const tasks = JSON.parse(fileContents);
      
      // Odeslání odpovědi se statusem 200 OK a daty ve formátu JSON
      res.status(200).json(tasks);
    } catch (error) {
      // Pokud soubor neexistuje nebo je poškozený, vracíme status 500 Internal Server Error
      res.status(500).json({ error: "Chyba při čtení souboru" });
    }
  } else {
    // Restrikce na povolené HTTP metody (status 405 Method Not Allowed)
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Metoda ${req.method} není povolena`);
  }
}