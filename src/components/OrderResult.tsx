interface CalculatedOrder {
  index: number;
  originalAmount: number;
  feeAmount: number;
  discountAmount: number;
  finalAmount: number;
}

interface OrderResultProps {
  order: CalculatedOrder;
}

const OrderResult = ({ order }: OrderResultProps) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border-l-3 border-blue-500 hover:shadow-md transition-all duration-200">
      <div className="font-semibold text-gray-800 mb-2 text-center bg-blue-100 px-2 py-1 rounded-full text-xs flex items-center justify-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Order {order.index}
      </div>
      
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className="text-center p-1 bg-gray-100 rounded">
          <div className="text-xs text-gray-600 mb-1 font-medium">Gốc</div>
          <div className="font-bold text-gray-800 text-xs">{order.originalAmount.toLocaleString()}đ</div>
        </div>
        <div className="text-center p-1 bg-green-100 rounded">
          <div className="text-xs text-gray-600 mb-1 font-medium">+ Phí</div>
          <div className="font-bold text-green-600 text-xs">{order.feeAmount.toLocaleString()}đ</div>
        </div>
        <div className="text-center p-1 bg-red-100 rounded">
          <div className="text-xs text-gray-600 mb-1 font-medium">- Giảm</div>
          <div className="font-bold text-red-600 text-xs">{order.discountAmount.toLocaleString()}đ</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-2 px-3 rounded text-center font-semibold text-xs flex items-center justify-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        Cuối: {order.finalAmount.toLocaleString()}đ
      </div>
    </div>
  );
};

export default OrderResult;
