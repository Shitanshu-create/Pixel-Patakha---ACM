import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabaseClient from '../config/supabase.js';
import { supabaseBucket, isSupabaseConfigured } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadSubmissionFile = async ({ file, reqProtocol = 'http', reqHost = 'localhost:3000' }) => {
  if (!file) {
    throw new ApiError(400, 'File buffer is required');
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname).toLowerCase();
  const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${basename}-${uniqueSuffix}${ext}`;

  // Always save a local copy in uploads/ for fast local AI processing & fallback
  const localFilePath = path.join(uploadsDir, filename);
  try {
    fs.writeFileSync(localFilePath, file.buffer);
  } catch (localErr) {
    console.warn('[Storage] Local cache write warning:', localErr.message);
  }

  let fileUrl = `${reqProtocol}://${reqHost}/uploads/${filename}`;

  // If Supabase is configured, upload to cloud storage
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.storage
        .from(supabaseBucket)
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error('[Supabase Storage Upload Error]:', error);
        throw new ApiError(500, `Supabase storage upload failed: ${error.message}`);
      }

      const { data: pubData } = supabaseClient.storage
        .from(supabaseBucket)
        .getPublicUrl(filename);

      if (pubData?.publicUrl) {
        fileUrl = pubData.publicUrl;
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('[Supabase Storage Exception]:', err);
      throw new ApiError(500, `Cloud upload error: ${err.message}`);
    }
  }

  return {
    originalName: file.originalname,
    filename,
    url: fileUrl,
    mimeType: file.mimetype,
    size: file.size,
  };
};

export const deleteSubmissionFile = async (filename) => {
  if (!filename) return;

  // Delete from Supabase Storage
  if (isSupabaseConfigured && supabaseClient) {
    try {
      await supabaseClient.storage.from(supabaseBucket).remove([filename]);
    } catch (err) {
      console.warn('[Supabase Storage Delete Warning]:', err.message);
    }
  }

  // Delete from local cache if present
  const localFilePath = path.join(uploadsDir, filename);
  if (fs.existsSync(localFilePath)) {
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkErr) {
      console.warn('[Storage Local Delete Warning]:', unlinkErr.message);
    }
  }
};

export const getFileBuffer = async (filename, fileUrl = '') => {
  // 1. Check local uploads directory first
  const localFilePath = path.join(uploadsDir, filename);
  if (fs.existsSync(localFilePath)) {
    return fs.readFileSync(localFilePath);
  }

  // 2. Download from Supabase Storage
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.storage
        .from(supabaseBucket)
        .download(filename);

      if (!error && data) {
        const arrayBuf = await data.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        // Cache locally for future checks
        try {
          fs.writeFileSync(localFilePath, buf);
        } catch {
          // ignore cache write error
        }
        return buf;
      }
    } catch (downloadErr) {
      console.warn('[Storage Supabase Download Warning]:', downloadErr.message);
    }
  }

  // 3. Fallback: fetch via public URL
  if (fileUrl && fileUrl.startsWith('http')) {
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        try {
          fs.writeFileSync(localFilePath, buf);
        } catch {
          // ignore cache write error
        }
        return buf;
      }
    } catch (fetchErr) {
      console.warn('[Storage URL Fetch Warning]:', fetchErr.message);
    }
  }

  return null;
};

export default {
  uploadSubmissionFile,
  deleteSubmissionFile,
  getFileBuffer,
};
