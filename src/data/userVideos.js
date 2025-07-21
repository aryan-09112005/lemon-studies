// src/utils/userVideos.js
const STORAGE_KEY = "userVideos";

/* Get all user videos from localStorage */
export function getUserVideos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* Add a new video */
export function addUserVideo(video) {
  const current = getUserVideos();
  current.push(video);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

/* Extract YouTube video ID from URL */
export function extractYouTubeId(url) {
  if (!url) return null;
  const regexList = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const r of regexList) {
    const m = url.match(r);
    if (m && m[1]) return m[1];
  }
  return null;
}
