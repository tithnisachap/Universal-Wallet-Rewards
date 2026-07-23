import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeBlock({ value, size = 220 }) {
    return (
        <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-6">
            <QRCodeSVG value={value} size={size} level="M" fgColor="#0c112c" />
        </div>
    );
}
