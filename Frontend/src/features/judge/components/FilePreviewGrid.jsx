import { formatFileSize } from '../../common/utils/formatFileSize.js';

export default function FilePreviewGrid({ files = [] }) {
  if (!files || files.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No design files found in this submission.</p>;
  }

  return (
    <div className="file-preview-gallery">
      {files.map((file, idx) => {
        const isPdf = file.mimeType === 'application/pdf' || file.filename?.endsWith('.pdf');

        return (
          <div key={idx} className="file-preview-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-cloud-white)', fontWeight: 700 }}>
                {file.originalName} ({formatFileSize(file.size)})
              </span>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--color-electric-cyan)', fontWeight: 700 }}
              >
                Open Full Asset ↗
              </a>
            </div>

            {isPdf ? (
              <div
                style={{
                  height: '240px',
                  backgroundColor: 'var(--color-cosmic-black)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-s)',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: 'var(--space-s)',
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>📄</span>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--fs-label)', color: 'var(--color-arcade-yellow)' }}>
                  PDF DOCUMENT
                </span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-electric-cyan)',
                    fontSize: 'var(--fs-small)',
                    textDecoration: 'underline',
                  }}
                >
                  Click to view / download PDF
                </a>
              </div>
            ) : (
              <img
                src={file.url}
                alt={file.originalName}
                className="file-preview-card__img"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
