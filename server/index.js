// /**
//  * File: index.js
//  * Purpose:
//  *   - This file sets up an Express server to handle requests from a React Native (Expo) app.
//  *   - We provide a POST endpoint (/export/drive) to accept user data and upload it to Google Drive.
//  *   - We use a Google service account to authenticate with Drive via the 'googleapis' package.
//  * 
//  * Relationship to Other Components:
//  *   - This server receives requests from the React Native client.
//  *   - It then communicates with the Google Drive API to create or upload a file.
//  *   - Finally, it returns a success or error response to the client.
//  */

// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');

// // Load environment variables (optional, if using .env files)
// // require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // If you have your service account JSON locally (not recommended for production):
// // const serviceAccount = require('../service-account.json'); // Make sure this file is .gitignored

// // Alternatively, if you store the JSON key in an environment variable, parse it:
// const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');

// // Create an auth client using the service account info
// const auth = new google.auth.JWT(
//   serviceAccount.client_email,
//   null,
//   serviceAccount.private_key,
//   ['https://www.googleapis.com/auth/drive']
// );

// // Prepare the Drive instance
// const drive = google.drive({ version: 'v3', auth });

// // A simple test endpoint
// app.get('/test', (req, res) => {
//   return res.json({ message: 'Server is running!' });
// });

// /**
//  * POST /export/drive
//  * Expects JSON body with: { peopleList: "string of people" }
//  * Creates a text file on Google Drive containing the provided data.
//  */
// app.post('/export/drive', async (req, res) => {
//   try {
//     const { peopleList } = req.body;

//     if (!peopleList) {
//       return res.status(400).json({ error: 'peopleList is required.' });
//     }

//     // Create a unique name for the file
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const fileName = `PeopleList_${timestamp}.txt`;

//     // We can optionally create or specify a folder; for simplicity, we just upload to root
//     // If you want to upload into a folder, you'd specify `parents: [folderId]` in fileMetadata
//     const fileMetadata = {
//       name: fileName,
//       // parents: ['<FOLDER_ID>'] // If needed
//     };

//     // The media object for the file content
//     const media = {
//       mimeType: 'text/plain',
//       body: peopleList, // The content from the request
//     };

//     // Upload the file
//     const response = await drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: 'id, name',
//     });

//     const uploadedFile = response.data;
//     console.log('File uploaded to Drive:', uploadedFile);

//     return res.status(200).json({
//       message: 'File exported successfully to Google Drive.',
//       fileId: uploadedFile.id,
//       fileName: uploadedFile.name,
//     });
//   } catch (error) {
//     console.error('Error exporting data to Drive:', error);
//     return res.status(500).json({ error: 'Failed to export data to Drive.' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
