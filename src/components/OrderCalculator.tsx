import { useState } from 'react';

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
    <div className="container">
      <div className="header">
        <h1 className="title">Order Calculator</h1>
        <p className="subtitle">Tính toán chia phí và giảm giá cho các đơn hàng</p>
      </div>

      <div className="form-section">
        <h3 className="section-title">Danh sách đơn hàng</h3>
        <div className="orders-container">
          {orders.map((order, index) => (
            <div key={order.id} className="order-item">
              <span className="order-label">Order {index + 1}:</span>
              <input
                type="number"
                className="order-input"
                placeholder="Nhập số tiền (k)"
                value={order.amount || ''}
                onChange={(e) => updateOrderAmount(order.id, parseFloat(e.target.value) || 0)}
              />
              <button 
                className="remove-btn" 
                onClick={() => removeOrder(order.id)}
                title="Xóa order"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button className="add-order-btn" onClick={addOrder}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
          </svg>
          Thêm Order
        </button>
      </div>

      <div className="form-section">
        <h3 className="section-title">Phí và giảm giá</h3>
        <div className="fee-discount-container">
          <div className="input-group">
            <label className="input-label">Phí thêm (k)</label>
            <input
              type="number"
              className="input-field"
              placeholder="19"
              value={additionalFee || ''}
              onChange={(e) => setAdditionalFee(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Tổng giảm giá (k)</label>
            <input
              type="number"
              className="input-field"
              placeholder="49"
              value={totalDiscount || ''}
              onChange={(e) => setTotalDiscount(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <button className="calculate-btn" onClick={calculateOrders}>
        Tính toán
      </button>

      {results && (
        <div className="results">
          <h3 className="results-title">Kết quả tính toán</h3>
          <div className="summary">
            <div className="summary-item">
              <div className="summary-label">Tổng ban đầu</div>
              <div className="summary-value">{results.totalOriginal.toLocaleString()}k</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Phí thêm</div>
              <div className="summary-value">+{results.totalFee.toLocaleString()}k</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Giảm giá</div>
              <div className="summary-value">-{results.totalDiscount.toLocaleString()}k</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Tổng cuối</div>
              <div className="summary-value">{results.totalFinal.toLocaleString()}k</div>
            </div>
          </div>
          <div className="order-results">
            {results.orders.map((order) => (
              <div key={order.index} className="order-result">
                <div className="order-result-header">Order {order.index}</div>
                <div className="order-breakdown">
                  <div className="breakdown-item">
                    <div className="breakdown-label">Gốc</div>
                    <div className="breakdown-value">{order.originalAmount}k</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">+ Phí</div>
                    <div className="breakdown-value">{order.feeAmount}k</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-label">- Giảm giá</div>
                    <div className="breakdown-value">{order.discountAmount}k</div>
                  </div>
                </div>
                <div className="final-amount">
                  Cuối cùng: {order.finalAmount.toLocaleString()}k
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCalculator;
