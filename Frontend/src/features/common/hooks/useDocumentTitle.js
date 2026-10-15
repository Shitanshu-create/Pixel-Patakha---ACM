import { useEffect } from 'react';

export default function useDocumentTitle(title, prefix = "PIXEL PATAKHA '26") {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} • ${prefix}` : prefix;

    return () => {
      document.title = prevTitle;
    };
  }, [title, prefix]);
}
