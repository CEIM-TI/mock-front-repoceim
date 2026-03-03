import { DocumentItem, DocumentVersion, User } from '../types';

// This service mocks calls that would normally go to Microsoft Graph API / SharePoint REST API

export const uploadDocumentVersion = async (
  documentId: string, 
  file: File, 
  currentUser: User, 
  changesDescription: string,
  currentVersions: DocumentVersion[]
): Promise<DocumentVersion> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Determine new version number (simple major version bump)
  let newVersionNum = '1.0';
  if (currentVersions && currentVersions.length > 0) {
    const latest = currentVersions[0].versionNumber;
    const major = parseInt(latest.split('.')[0] || '1', 10);
    newVersionNum = `${major + 1}.0`;
  }

  // Create a mock URL for the "uploaded" file using Object URL
  const mockFileUrl = URL.createObjectURL(file);

  const newVersion: DocumentVersion = {
    versionNumber: newVersionNum,
    date: new Date().toISOString().split('T')[0],
    modifiedBy: currentUser.name,
    changes: changesDescription || `Actualización de archivo: ${file.name}`,
    fileUrl: mockFileUrl
  };

  return newVersion;
};

export const downloadDocument = async (version: DocumentVersion, docTitle: string) => {
  // Simulate download delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (version.fileUrl) {
    // If we have a local mock URL from upload, trigger download
    const a = document.createElement('a');
    a.href = version.fileUrl;
    a.download = `${docTitle}_v${version.versionNumber}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // Simulate downloading a dummy file if no real file was attached
    const blob = new Blob([`Contenido simulado para el documento: ${docTitle}\nVersión: ${version.versionNumber}\nAutor: ${version.modifiedBy}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/\s+/g, '_')}_v${version.versionNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
