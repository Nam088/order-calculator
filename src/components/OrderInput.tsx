import { useState } from 'react';

interface OrderInputProps {
  order: {
    id: number;
    amount: number;
  };
  index: number;
  onUpdateAmount: (id: number, amount: number) => void;
  onRemove: (id: number) => void;
}

const OrderInput = ({ order, index, onUpdateAmount, onRemove }: OrderInputProps) => {
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
    onUpdateAmount(order.id, numericValue);
    
    // Tạo gợi ý mới nếu giá trị > 0 và khác với giá trị hiện tại
    if (numericValue > 0 && numericValue !== order.amount) {
      setSuggestions(generateSuggestions(numericValue));
    } else if (numericValue === 0) {
      setSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    if (order.amount > 0) {
      setDisplayValue(order.amount.toString());
    }
  };

  const handleInputBlur = () => {
    if (order.amount > 0) {
      setDisplayValue(formatCurrency(order.amount));
    } else {
      setDisplayValue('');
    }
  };

  const applySuggestion = (suggestedAmount: number) => {
    onUpdateAmount(order.id, suggestedAmount);
    setDisplayValue(formatCurrency(suggestedAmount));
    setSuggestions([]); // Ẩn suggestions sau khi click
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700 bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Order {index + 1}
        </span>
        <button 
          className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          onClick={() => onRemove(order.id)}
          title="Xóa order"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Input */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          placeholder="Nhập số tiền (VND)"
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
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              {suggestion.toLocaleString()}đ
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderInput;
