import express from 'express';
import { googleDriveService } from './googleDriveService.js';
import { google } from 'googleapis';
import cors from 'cors';



const SERVICE_ACCOUNT_KEY_PATH = './voting-app-service.json';
const PERSONAL_EMAIL = 'dsboku26@colby.edu';

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/export', async (req, res) => {
  try {
    const { eventInfo, summary, voters, attendance } = req.body;

    // Create event-specific folder with date
    const folderName = `${eventInfo.name} - ${new Date(eventInfo.date).toLocaleDateString()}`;
    // const folderName = 'Test - real1'
    const folderId = await googleDriveService.createFolder(folderName);

    // Convert each dataset to CSV
    const summaryCSV = convertToCSV(summary);
    const votersCSV = convertToCSV(voters);
    const attendanceCSV = convertToCSV(attendance);

    // Upload each file
    const summaryFileId = await googleDriveService.uploadFile('voting_summary.csv', summaryCSV, folderId);
    const votersFileId = await googleDriveService.uploadFile('voters.csv', votersCSV, folderId);
    const attendanceFileId = await googleDriveService.uploadFile('attendance.csv', attendanceCSV, folderId);
    
    // 4. Share the file with your personal email so it appears in "Shared with me"
    // await shareFile(summaryFileId, PERSONAL_EMAIL);
    // await shareFile(votersFileId, PERSONAL_EMAIL);
    // await shareFile(attendanceFileId, PERSONAL_EMAIL);

    await shareFolder(folderId, PERSONAL_EMAIL);

    res.json({
      message: 'Export successful',
      folder: { id: folderId, name: folderName },
      files: {
        summary: summaryFileId,
        voters: votersFileId,
        attendance: attendanceFileId
      }
    });
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ error: 'Export failed', details: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Function to convert JSON data (array of objects) into CSV string
function convertToCSV(data) {
  if (!data || data.length === 0) {
    return '';
  }

  const header = Object.keys(data[0]);
  const csvRows = [header.join(',')];

  for (const row of data) {
    const values = header.map(field => {
      let value = row[field] === undefined ? '' : row[field];
      if (typeof value === 'string') {
        // Escape double quotes and wrap in quotes if needed
        if (value.includes(',') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// Function to share a folder with a specific email address
async function shareFolder(folderId, emailAddress) {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  const drive = google.drive({ version: 'v3', auth });

  const permission = {
    type: 'user',
    role: 'writer',
    emailAddress: emailAddress
  };

  try {
    const response = await drive.permissions.create({
      fileId: folderId,
      requestBody: permission,
      fields: 'id'
    });
    console.log('Folder permission created with ID:', response.data.id);
    return response.data.id;
  } catch (error) {
    console.error('Error sharing folder:', error);
    throw error;
  }
}
