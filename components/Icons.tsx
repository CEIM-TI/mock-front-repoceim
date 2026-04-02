import React from 'react';

export const FolderIcon = ({ colorClass = "text-yellow-400" }: { colorClass?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${colorClass}`}>
    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
  </svg>
);

export const SharePointIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-sharepoint">
    <path d="M19.14 4.58c.84 0 1.52.68 1.52 1.52v11.8c0 .84-.68 1.52-1.52 1.52H4.86c-.84 0-1.52-.68-1.52-1.52V6.1c0-.84.68-1.52 1.52-1.52h14.28zM12 6.55v4.54H7.55V6.55H12zm4.45 0v4.54h-4.45V6.55h4.45zm0 8.91v-4.36h-4.45v4.36h4.45zm-4.45 0v-4.36H7.55v4.36H12z"/>
  </svg>
);

export const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
