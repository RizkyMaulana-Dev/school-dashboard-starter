import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

interface QrScannerProps {
    onClose?: () => void;
}

export function QrScanner({ onClose }: QrScannerProps) {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [parsedJson, setParsedJson] = useState<any | null>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleScan = (detectedCodes: any[]) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const rawValue = detectedCodes[0].rawValue;

            if (rawValue === scannedData) return;

            setScannedData(rawValue);

            try {
                const jsonData = JSON.parse(rawValue);
                setParsedJson(jsonData);
            } catch (err) {
                setParsedJson(null);
            }
        }
    };

    return (
        <div className="relative max-w-md mx-auto p-4 bg-white rounded-xl shadow-md border w-full max-h-[90vh] overflow-y-auto">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1 bg-white rounded-full text-gray-500 hover:text-gray-800 shadow-sm border cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">QR Scanner</h2>

            <div className="rounded-lg overflow-hidden border bg-black mb-6 relative">
                <Scanner
                    onScan={handleScan}
                    onError={(error) => console.error(error?.message)}
                    paused={!!scannedData}
                    components={{
                        onOff: true,
                        torch: true,
                        zoom: true,
                        finder: true,
                    }}
                />
            </div>

            {scannedData && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Hasil Scan:</h3>

                    {parsedJson ? (
                        <div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded mb-2 inline-block">
                                Valid JSON
                            </span>
                            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto shadow-inner whitespace-pre-wrap">
                                {JSON.stringify(parsedJson, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <div>
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded mb-2 inline-block">
                                Plain Text
                            </span>
                            <p className="text-gray-600 break-words bg-white p-3 border rounded shadow-sm">
                                {scannedData}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setScannedData(null);
                            setParsedJson(null);
                        }}
                        className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium cursor-pointer"
                    >
                        Reset / Scan Ulang
                    </button>
                </div>
            )}
        </div>
    );
}