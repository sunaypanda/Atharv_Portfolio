import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PDFViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      className="pdf-container"
      ref={containerRef}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div style={{ padding: '20px' }}>Loading Portfolio...</div>}
        error={<div style={{ padding: '20px' }}>Failed to load PDF.</div>}
        className="pdf-document"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerWidth || window.innerWidth}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            className="pdf-page"
            loading=""
          />
        ))}
      </Document>
    </div>
  );
}
