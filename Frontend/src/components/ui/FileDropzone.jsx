import { useState, useRef, useEffect, useMemo } from 'react';
import './FileDropzone.css';

const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];

export default function FileDropzone({
  files = [],
  onChange,
  maxFiles = 5,
  maxSizeMb = 10,
  error,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [clientError, setClientError] = useState('');
  const inputRef = useRef(null);

  // Generate and manage object URLs cleanly with cleanup on unmount/files change
  const previewUrls = useMemo(() => {
    return files.map((file) => {
      const isImage = file.type?.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(file.name);
      return isImage ? URL.createObjectURL(file) : null;
    });
  }, [files]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const validateAndAdd = (newFileList) => {
    setClientError('');
    const valid = [];
    const maxBytes = maxSizeMb * 1024 * 1024;

    if (files.length + newFileList.length > maxFiles) {
      setClientError(`Maximum of ${maxFiles} files allowed.`);
      return;
    }

    for (const file of newFileList) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTS.includes(ext)) {
        setClientError(`Invalid format "${ext}". Allowed: PNG, JPG, JPEG, WEBP, PDF.`);
        return;
      }
      if (file.size > maxBytes) {
        setClientError(`File "${file.name}" exceeds maximum size of ${maxSizeMb}MB.`);
        return;
      }
      valid.push(file);
    }

    onChange([...files, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      validateAndAdd(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemove = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="file-dropzone-container">
      <div
        className={`file-dropzone ${isDragOver ? 'file-dropzone--drag-over' : ''} ${error || clientError ? 'file-dropzone--error' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) {
              validateAndAdd(Array.from(e.target.files));
              e.target.value = '';
            }
          }}
        />
        <div className="file-dropzone__icon" aria-hidden="true">⬆</div>
        <div className="file-dropzone__text">
          <strong>Click to upload</strong> or drag and drop designs
        </div>
        <div className="file-dropzone__hint">
          PNG, JPG, WEBP, or PDF (up to {maxFiles} files, max {maxSizeMb}MB each)
        </div>
      </div>

      {(clientError || error) && (
        <div className="form-field__error" style={{ marginTop: 'var(--space-xs)' }} role="alert">
          <span aria-hidden="true">✖</span>
          <span>{clientError || error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-previews">
          {files.map((file, idx) => {
            const previewUrl = previewUrls[idx];

            return (
              <div key={`${file.name}-${idx}`} className="file-preview-item">
                <button
                  type="button"
                  className="file-preview-item__remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  aria-label={`Remove file ${file.name}`}
                >
                  ✕
                </button>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="file-preview-item__thumb"
                  />
                ) : (
                  <div className="file-preview-item__placeholder">
                    <span aria-hidden="true">📄</span>
                    <span>PDF</span>
                  </div>
                )}
                <div className="file-preview-item__name" title={file.name}>
                  {file.name}
                </div>
                <div className="file-preview-item__size">{formatSize(file.size)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
