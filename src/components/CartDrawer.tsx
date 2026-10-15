import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { BakeryImage } from './BakeryImage';
import { X, Trash2, Plus, Minus, CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    completeOrder,
    lastOrderReceipt,
    setLastOrderReceipt,
  } = useBakery();

  const [fulfillmentType, setFulfillmentType] = useState<'boutique-pickup' | 'chilled-courier'>('boutique-pickup');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('11:00');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
  const packagingFee = subtotal > 0 ? 3.50 : 0;
  const courierFee = fulfillmentType === 'chilled-courier' ? 14.00 : 0;
  const tax = Number((subtotal * 0.085).toFixed(2));
  const total = Number((subtotal + packagingFee + courierFee + tax).toFixed(2));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      completeOrder({
        customerName,
        email,
        phone,
        fulfillmentType,
        pickupDate,
        pickupTime,
        deliveryAddress: fulfillmentType === 'chilled-courier' ? deliveryAddress : undefined,
        giftMessage: giftMessage.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E8E2D8] shadow-2xl flex flex-col justify-between text-stone-900">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif text-xl text-stone-900">Your Pastry Order Bag</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {lastOrderReceipt ? (
              /* Post-Order Receipt View */
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#9E7D3B]">
                  Commande Confirmée
                </span>
                <h3 className="font-serif text-2xl text-stone-900">
                  Order #{lastOrderReceipt.orderNumber}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Thank you, {lastOrderReceipt.customerName}. Your pastries have been scheduled for fresh preparation on {lastOrderReceipt.pickupDate} at {lastOrderReceipt.pickupTime}.
                </p>

                <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] text-left text-xs space-y-2">
                  <div className="flex justify-between font-semibold pb-1 border-b border-[#E8E2D8]">
                    <span>Fulfillment</span>
                    <span className="capitalize">{lastOrderReceipt.fulfillmentType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Paid:</span>
                    <span className="font-mono font-semibold tabular-nums">${lastOrderReceipt.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Contact:</span>
                    <span>{lastOrderReceipt.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLastOrderReceipt(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Bag State */
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="font-serif text-lg text-stone-800">Your bag is currently empty</p>
                <p className="text-xs text-stone-500">
                  Explore our handcrafted entremets or build a bespoke couture box.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] cursor-pointer"
                >
                  Browse Creations
                </button>
              </div>
            ) : (
              /* Items List + Checkout Form */
              <div className="space-y-6">
                <div className="space-y-3 divide-y divide-[#E8E2D8]">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                      <div className="flex gap-3">
                        {item.imageUrl && (
                          <BakeryImage
                            src={item.imageUrl}
                            itemId={item.dessertId}
                            alt={item.dessertName}
                            className="w-14 h-14 object-cover border border-[#E8E2D8] shrink-0"
                          />
                        )}
                        <div className="space-y-0.5">
                          <p className="font-serif text-sm font-medium text-stone-900 leading-snug">
                            {item.dessertName}
                          </p>
                          <p className="text-stone-500 tabular-nums">
                            ${item.unitPrice.toFixed(2)} each
                          </p>
                          {item.customInscription && (
                            <p className="text-[11px] text-[#9E7D3B] italic">
                              "{item.customInscription}"
                            </p>
                          )}
                          {item.boxItems && (
                            <p className="text-[10px] text-stone-400">
                              {item.boxItems.map((b) => `${b.quantity}x ${b.name}`).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="font-mono font-medium text-stone-900 tabular-nums">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center border border-[#E8E2D8]">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-stone-400 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Form */}
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-[#E8E2D8]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9E7D3B] block">
                    Fulfillment & Pickup Time
                  </span>

                  {/* Fulfillment Type Buttons */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('boutique-pickup')}
                      className={`py-2 px-3 border text-left cursor-pointer transition-colors ${
                        fulfillmentType === 'boutique-pickup'
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-[#E8E2D8] bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <p className="font-medium">Boutique Pickup</p>
                      <p className="text-[10px] opacity-75">Place Vendôme (Free)</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('chilled-courier')}
                      className={`py-2 px-3 border text-left cursor-pointer transition-colors ${
                        fulfillmentType === 'chilled-courier'
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-[#E8E2D8] bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <p className="font-medium">Chilled Courier</p>
                      <p className="text-[10px] opacity-75">Paris Metro (+$14.00)</p>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Time Slot</label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                      >
                        <option value="09:00">09:00 - 10:30</option>
                        <option value="11:00">11:00 - 12:30</option>
                        <option value="14:00">14:00 - 15:30</option>
                        <option value="16:00">16:00 - 17:30</option>
                        <option value="18:00">18:00 - 19:30</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marie-Claire Dupont"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="marie@dupont.fr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+33 6 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {fulfillmentType === 'chilled-courier' && (
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Paris Delivery Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="18 Rue de la Paix, 75002 Paris"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Gift Note / Dietary Instructions</label>
                    <input
                      type="text"
                      placeholder="Optional notes for the kitchen..."
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Drawer Footer with Tabular Price & Place Order */}
          {cart.length > 0 && !lastOrderReceipt && (
            <div className="p-6 bg-[#FAF7F2] border-t border-[#E8E2D8] space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Luxury Gold Packaging:</span>
                  <span className="font-mono tabular-nums">${packagingFee.toFixed(2)}</span>
                </div>
                {fulfillmentType === 'chilled-courier' && (
                  <div className="flex justify-between">
                    <span>Chilled Van Delivery:</span>
                    <span className="font-mono tabular-nums">${courierFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%):</span>
                  <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-stone-900 pt-2 border-t border-[#E8E2D8]">
                  <span>Total Amount:</span>
                  <span className="tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isSubmitting ? 'Securing Pastries...' : 'Confirm Pre-Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
