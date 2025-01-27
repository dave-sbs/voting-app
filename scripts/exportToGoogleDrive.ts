// import { googleDriveService } from '../services/googleDriveService';
// import { Voter } from '@/scripts/votingAPI';

// // For check-in data
// interface AttendanceData extends Omit<Voter, 'has_voted'> {
//     member_name?: string; // Optional field that we'll populate if available
// }

// // For unique voters data
// interface VoterData extends Omit<Voter, 'updated_check_in_time' | 'has_voted'> {
//     member_name?: string; // Optional field that we'll populate if available
// }

// // For candidate summary data
// interface CandidateData {
//     name: string;
//     vote_count: number;
// }

// interface ExportData {
//     attendance: AttendanceData[];
//     uniqueVoters: VoterData[];
//     activeCandidates: CandidateData[];
// }

// export async function exportEventDataToGoogleDrive(
//     eventDate: Date,
//     eventType: string,
//     data: ExportData
// ): Promise<boolean> {
//     try {
//         // Create main folder with format "DATE: EVENT_TYPE"
//         const formattedDate = eventDate.toISOString().split('T')[0];
//         const mainFolderName = `${formattedDate}: ${eventType}`;
//         const mainFolderId = await googleDriveService.createFolder(mainFolderName);

//         // Create subfolders
//         const attendanceFolderId = await googleDriveService.createFolder('Attendance', mainFolderId);
//         const votersFolderId = await googleDriveService.createFolder('Unique Voters', mainFolderId);
//         const candidatesFolderId = await googleDriveService.createFolder('Active Candidates and Vote Count', mainFolderId);

//         // Format data for export
//         const formattedData = {
//             attendance: data.attendance.map(item => ({
//                 ...item,
//                 check_in_time: item.check_in_time.toISOString(),
//             })),
//             uniqueVoters: data.uniqueVoters.map(item => ({
//                 ...item,
//                 check_in_time: item.check_in_time.toISOString(),
//             })),
//             activeCandidates: data.activeCandidates
//         };

//         // Upload data to respective folders
//         const uploadTasks = [
//             // Attendance data
//             googleDriveService.uploadFile(
//                 `attendance_${formattedDate}.json`,
//                 JSON.stringify(formattedData.attendance, null, 2),
//                 attendanceFolderId
//             ),
//             // Unique voters data
//             googleDriveService.uploadFile(
//                 `unique_voters_${formattedDate}.json`,
//                 JSON.stringify(formattedData.uniqueVoters, null, 2),
//                 votersFolderId
//             ),
//             // Active candidates data
//             googleDriveService.uploadFile(
//                 `active_candidates_${formattedDate}.json`,
//                 JSON.stringify(formattedData.activeCandidates, null, 2),
//                 candidatesFolderId
//             )
//         ];

//         // Wait for all uploads to complete
//         const fileIds = await Promise.all(uploadTasks);

//         // Verify all files were uploaded successfully
//         const verificationTasks = fileIds.map(fileId => 
//             googleDriveService.verifyFile(fileId)
//         );

//         const verificationResults = await Promise.all(verificationTasks);
        
//         // Return true only if all files were verified successfully
//         return verificationResults.every(result => result === true);
//     } catch (error) {
//         console.error('Error exporting to Google Drive:', error);
//         throw error;
//     }
// }
