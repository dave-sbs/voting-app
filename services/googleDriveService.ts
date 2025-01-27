// import { google } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';

// // These will be loaded from environment variables
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// class GoogleDriveService {
//     private oauth2Client: OAuth2Client;
//     private drive: any;
//     private initialized: boolean = false;

//     constructor() {
//         this.oauth2Client = new OAuth2Client(
//             GOOGLE_CLIENT_ID,
//             GOOGLE_CLIENT_SECRET,
//             GOOGLE_REDIRECT_URI
//         );
//         this.initialize();
//     }

//     private async initialize() {
//         if (this.initialized) return;

//         this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
//         this.initialized = true;
//     }

//     async setCredentials(credentials: any) {
//         this.oauth2Client.setCredentials(credentials);
//         await this.initialize();
//     }

//     async createFolder(folderName: string, parentId?: string): Promise<string> {
//         await this.initialize();
//         try {
//             const folderMetadata = {
//                 name: folderName,
//                 mimeType: 'application/vnd.google-apps.folder',
//                 parents: parentId ? [parentId] : undefined
//             };

//             const response = await this.drive.files.create({
//                 resource: folderMetadata,
//                 fields: 'id'
//             });

//             return response.data.id;
//         } catch (error) {
//             console.error('Error creating folder:', error);
//             throw error;
//         }
//     }

//     async uploadFile(fileName: string, content: string, folderId: string): Promise<string> {
//         await this.initialize();
//         try {
//             const fileMetadata = {
//                 name: fileName,
//                 parents: [folderId]
//             };

//             const media = {
//                 mimeType: 'text/plain',
//                 body: content
//             };

//             const response = await this.drive.files.create({
//                 resource: fileMetadata,
//                 media: media,
//                 fields: 'id'
//             });

//             return response.data.id;
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             throw error;
//         }
//     }

//     async verifyFile(fileId: string): Promise<boolean> {
//         await this.initialize();
//         try {
//             const response = await this.drive.files.get({
//                 fileId: fileId,
//                 fields: 'id, name'
//             });
//             return !!response.data.id;
//         } catch (error) {
//             console.error('Error verifying file:', error);
//             return false;
//         }
//     }
// }

// export const googleDriveService = new GoogleDriveService();
