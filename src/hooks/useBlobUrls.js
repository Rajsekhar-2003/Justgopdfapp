import { useEffect, useState } from 'react';

/** Creates object URLs for blobs and revokes them when blobs change or the component unmounts. */
export default function useBlobUrls(blobs) {
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const created = blobs.map((b) => URL.createObjectURL(b));
    setUrls(created);
    return () => created.forEach((u) => URL.revokeObjectURL(u));
  }, [blobs]);
  return urls;
}
