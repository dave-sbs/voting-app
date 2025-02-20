import { google } from 'googleapis';

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    if (this.initialized) return;
    
    const auth = new google.auth.GoogleAuth({
      keyFile: './voting-app-service.json',
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    this.drive = google.drive({ version: 'v3', auth });
    this.initialized = true;
  }

  async createFolder(folderName, parentId) {
    await this.initialize();
    try {
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined
      };

      const response = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id'
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async uploadFile(fileName, content, folderId) {
    await this.initialize();
    try {
      const fileMetadata = {
        name: fileName,
        parents: [folderId]
      };

      const media = {
        mimeType: 'text/plain',
        body: content
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      });

      return response.data.id;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async verifyFile(fileId) {
    await this.initialize();
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name'
      });
      return !!response.data.id;
    } catch (error) {
      console.error('Error verifying file:', error);
      return false;
    }
  }
}

const googleDriveService = new GoogleDriveService();
export { googleDriveService };
