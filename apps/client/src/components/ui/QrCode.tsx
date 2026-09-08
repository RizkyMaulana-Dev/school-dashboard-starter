// ./apps/client/src/components/ui/QrCode.tsx
import { useId } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeProps {
    value: string;
    size?: number;
    includeMargin?: boolean;
    downloadable?: boolean;
    label?: string;
}

export default function QrCode({
    value,
    size = 200,
    includeMargin = true,
    downloadable = false,
    label,
}: QrCodeProps) {
    // Menggunakan ID unik React agar aman dari karakter JSON
    const uniqueId = useId().replace(/:/g, '');
    const elementId = `qr-code-${uniqueId}`;

    const handleDownload = () => {
        const svgElement = document.getElementById(elementId) as SVGElement | null;
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.href = pngFile;
            downloadLink.download = `QR-${label ? label.replace(/\s+/g, '_') : 'code'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        // Menggunakan encodeURIComponent agar aman untuk karakter non-ASCII
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit">
            <QRCodeSVG
                id={elementId}
                value={value}
                size={size}
                level="M"
                includeMargin={includeMargin}
            />

            {label && (
                <span className="text-xs font-mono font-bold text-gray-600 mt-2">
                    {label}
                </span>
            )}

            {downloadable && (
                <button
                    onClick={handleDownload}
                    type="button"
                    className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors"
                >
                    Download QR
                </button>
            )}
        </div>
    );
}