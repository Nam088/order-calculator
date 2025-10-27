import { useState } from 'react';

interface FeeDiscountInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
  color: 'green' | 'red';
}

const FeeDiscountInput = ({ label, value, onChange, placeholder, color }: FeeDiscountInputProps) => {
  const [suggestions, setSuggestions] = useState<number[]>([]);
  const [displayValue, setDisplayValue] = useState<string>('');

  const generateSuggestions = (value: number): number[] => {
    if (value <= 0) return [];
    
    const str = value.toString();
    const suggestions: number[] = [];
    
    if (str.length === 1) {
      suggestions.push(value * 1000, value * 10000, value * 100000);
    } else if (str.length === 2) {
      suggestions.push(value * 100, value * 1000, value * 10000);
    } else if (str.length === 3) {
      suggestions.push(value * 100, value * 1000, value * 10000);
    } else if (str.length >= 4) {
      suggestions.push(value * 10, value * 100, value * 1000);
    }
    
    return suggestions.filter(s => s !== value).slice(0, 3);
  };

  const formatCurrency = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('vi-VN');
  };

  const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseCurrency(inputValue);
    
    setDisplayValue(inputValue);
    onChange(numericValue);
    
    // Tạo gợi ý mới nếu giá trị > 0 và khác với giá trị hiện tại
    if (numericValue > 0 && numericValue !== value) {
      setSuggestions(generateSuggestions(numericValue));
    } else if (numericValue === 0) {
      setSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    if (value > 0) {
      setDisplayValue(value.toString());
    }
  };

  const handleInputBlur = () => {
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    } else {
      setDisplayValue('');
    }
  };

  const applySuggestion = (suggestedAmount: number) => {
    onChange(suggestedAmount);
    setDisplayValue(formatCurrency(suggestedAmount));
    setSuggestions([]); // Ẩn suggestions sau khi click
  };

  const colorClasses = {
    green: {
      container: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
      label: 'text-green-600',
      icon: 'text-green-500',
      input: 'border-green-300 focus:ring-green-500',
      suggestions: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    red: {
      container: 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200',
      label: 'text-red-600',
      icon: 'text-red-500',
      input: 'border-red-300 focus:ring-red-500',
      suggestions: 'bg-red-100 text-red-700 hover:bg-red-200'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`rounded-xl p-6 border ${classes.container}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className={`w-4 h-4 ${classes.label}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        {label}
      </label>
      
      
      <div className="relative">
        <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${classes.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <input
          type="text"
          className={`w-full pl-10 pr-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white shadow-sm ${classes.input}`}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-2 flex gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => applySuggestion(suggestion)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${classes.suggestions}`}
            >
              {suggestion.toLocaleString()}đ
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeeDiscountInput;
