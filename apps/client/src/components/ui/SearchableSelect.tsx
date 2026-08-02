import { useState, useRef, useEffect, type ChangeEvent } from 'react';

interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SearchableSelectProps {
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Cari...',
    label,
    error,
    disabled,
    className = '',
}: SearchableSelectProps) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Sinkronisasi label berdasarkan value
    useEffect(() => {
        if (value) {
            const selected = options.find((opt) => opt.value === value);
            setSelectedLabel(selected?.label || '');
        } else {
            setSelectedLabel('');
        }
    }, [value, options]);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (opt: Option) => {
        onChange(opt.value);
        setSelectedLabel(opt.label);
        setSearch('');
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                type="text"
                className={`w-full rounded-md border px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100`}
                placeholder={placeholder}
                value={isOpen ? search : selectedLabel}
                disabled={disabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => {
                    setIsOpen(true);
                    setSearch('');
                }}
            />
            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white shadow-lg border border-gray-200">
                    {filteredOptions.length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</li>
                    )}
                    {filteredOptions.map((opt) => (
                        <li
                            key={opt.value}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            onClick={() => {
                                if (!opt.disabled) handleSelect(opt);
                            }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}