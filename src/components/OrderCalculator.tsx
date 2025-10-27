import { useState } from 'react';
import OrderInput from './OrderInput';
import FeeDiscountInput from './FeeDiscountInput';
import OrderResult from './OrderResult';

interface Order {
  id: number;
  amount: number;
}

interface CalculatedOrder {
  index: number;
  originalAmount: number;
  feeAmount: number;
  discountAmount: number;
  finalAmount: number;
}

interface CalculationResult {
  orders: CalculatedOrder[];
  totalOriginal: number;
  totalFee: number;
  totalDiscount: number;
  totalFinal: number;
}

const OrderCalculator = () => {
  const [orders, setOrders] = useState<Order[]>([{ id: 1, amount: 0 }]);
  const [additionalFee, setAdditionalFee] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [nextId, setNextId] = useState<number>(2);

  const addOrder = () => {
    setOrders(prev => [...prev, { id: nextId, amount: 0 }]);
    setNextId(prev => prev + 1);
  };

  const removeOrder = (id: number) => {
    if (orders.length > 1) {
      setOrders(prev => prev.filter(order => order.id !== id));
    } else {
      alert('Phải có ít nhất 1 order!');
    }
  };

  const updateOrderAmount = (id: number, amount: number) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, amount } : order
      )
    );
  };

  const calculateOrders = () => {
    const orderAmounts = orders.map(order => order.amount);
    
    if (orderAmounts.some(amount => amount <= 0)) {
      alert('Vui lòng nhập số tiền hợp lệ cho tất cả orders!');
      return;
    }

    const totalOriginal = orderAmounts.reduce((sum, amount) => sum + amount, 0);
    const discountPerOrder = totalDiscount / orders.length;
    
    const calculatedOrders: CalculatedOrder[] = orderAmounts.map((orderAmount, index) => {
      const feeRatio = orderAmount / totalOriginal;
      const feeAmount = additionalFee * feeRatio;
      const finalAmount = orderAmount + feeAmount - discountPerOrder;
      
      return {
        index: index + 1,
        originalAmount: orderAmount,
        feeAmount: Math.round(feeAmount * 100) / 100,
        discountAmount: discountPerOrder,
        finalAmount: Math.round(finalAmount * 100) / 100
      };
    });

    const totalFinal = calculatedOrders.reduce((sum, order) => sum + order.finalAmount, 0);

    setResults({
      orders: calculatedOrders,
      totalOriginal,
      totalFee: additionalFee,
      totalDiscount,
      totalFinal: Math.round(totalFinal * 100) / 100
    });
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Order Calculator
        </h1>
        <p className="text-gray-600 text-sm">Tính toán phí và giảm giá cho đơn hàng</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Orders Grid */}
        <div className="xl:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Danh sách đơn hàng
          </h3>
          
          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {orders.map((order, index) => (
              <OrderInput
                key={order.id}
                order={order}
                index={index}
                onUpdateAmount={updateOrderAmount}
                onRemove={removeOrder}
              />
            ))}
          </div>
          
          <button 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            onClick={addOrder}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Thêm Order
          </button>
        </div>

        {/* Right Column - Fee & Discount */}
        <div className="xl:col-span-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Phí và giảm giá
          </h3>
          
          <div className="space-y-6">
            <FeeDiscountInput
              label="Phí thêm (VND)"
              value={additionalFee}
              onChange={setAdditionalFee}
              placeholder="Nhập phí (VND)"
              color="green"
            />
            
            <FeeDiscountInput
              label="Tổng giảm giá (VND)"
              value={totalDiscount}
              onChange={setTotalDiscount}
              placeholder="Nhập giảm giá (VND)"
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mt-6">
        <button 
          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          onClick={calculateOrders}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Tính toán
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Kết quả tính toán
          </h3>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-gray-200">
              <div className="text-xs text-gray-600 mb-1 font-medium flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tổng ban đầu
              </div>
              <div className="text-sm font-bold text-gray-800">{results.totalOriginal.toLocaleString()}đ</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-green-200">
              <div className="text-xs text-gray-600 mb-1 font-medium flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Phí thêm
              </div>
              <div className="text-sm font-bold text-green-600">+{results.totalFee.toLocaleString()}đ</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-red-200">
              <div className="text-xs text-gray-600 mb-1 font-medium flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                Giảm giá
              </div>
              <div className="text-sm font-bold text-red-600">-{results.totalDiscount.toLocaleString()}đ</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-blue-200">
              <div className="text-xs text-gray-600 mb-1 font-medium flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Tổng cuối
              </div>
              <div className="text-sm font-bold text-blue-600">{results.totalFinal.toLocaleString()}đ</div>
            </div>
          </div>

          {/* Order Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.orders.map((order) => (
              <OrderResult key={order.index} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCalculator;
