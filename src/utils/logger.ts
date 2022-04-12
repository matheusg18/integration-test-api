import fs from 'fs/promises';
import path from 'path';

export default class Logger {
  private static _filePath = path.resolve(__dirname, '../../logs.txt');

  public static async save(info: string): Promise<void> {
    const sentence = `${new Date().toLocaleString('pt-BR')}: ${info}\n`;

    fs.writeFile(Logger._filePath, sentence, { flag: 'a' });
  }
}
