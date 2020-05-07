import fs from 'fs';
import path from 'path';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename();
  }

  public async deleteFile(file: string): Promise<void> {}
}

export default DiskStorageProvider;
