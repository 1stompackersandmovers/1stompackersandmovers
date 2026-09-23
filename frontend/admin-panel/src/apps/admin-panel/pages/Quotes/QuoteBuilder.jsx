import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calculator,
  Shield,
  Percent,
  CheckCircle,
  Truck,
  Box,
} from "lucide-react";
import { useCreateQuoteMutation } from "../../../../store/apiSlices/quotesApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const COMMON_ITEMS = [
  { name: "Double Bed with Mattress", category: "Bedroom", cft: 35 },
  { name: "Single Bed", category: "Bedroom", cft: 20 },
  { name: "Almirah / Wardrobe (Steel/Wood)", category: "Bedroom", cft: 40 },
  { name: "Dressing Table", category: "Bedroom", cft: 15 },
  { name: "Sofa Set (3+1+1)", category: "Living Room", cft: 50 },
  { name: "Center Table / Glass Table", category: "Living Room", cft: 10 },
  { name: "TV (43\" - 65\") Packed", category: "Living Room", cft: 10 },
  { name: "TV Unit / Showcase", category: "Living Room", cft: 25 },
  { name: "Refrigerator (Single/Double Door)", category: "Kitchen", cft: 25 },
  { name: "Washing Machine", category: "Kitchen", cft: 18 },
  { name: "Dining Table with Chairs", category: "Kitchen", cft: 30 },
  { name: "Microwave Oven / RO Filter", category: "Kitchen", cft: 8 },
  { name: "Standard Carton Box (Packed Goods)", category: "Boxes", cft: 4 },
  { name: "Two-Wheeler (Bike / Scooty)", category: "Vehicle", cft: 45 },
  { name: "Split AC (Indoor + Outdoor Unit)", category: "Appliances", cft: 15 },
];

const QuoteBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [leadId, setLeadId] = useState(searchParams.get("leadId") || "");
  const [customerName, setCustomerName] = useState(searchParams.get("name") || "");
  const [customerPhone, setCustomerPhone] = useState(searchParams.get("phone") || "");
  const [movingFrom, setMovingFrom] = useState(searchParams.get("from") || "");
  const [movingTo, setMovingTo] = useState(searchParams.get("to") || "");
  const [moveDate, setMoveDate] = useState("");

  // Inventory
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItemName, setCustomItemName] = useState("");

  // Pricing Charges
  const [packagingCharges, setPackagingCharges] = useState(3500);
  const [transportCharges, setTransportCharges] = useState(8500);
  const [loadingCharges, setLoadingCharges] = useState(1500);
  const [unloadingCharges, setUnloadingCharges] = useState(1500);

  // Insurance
  const [insuranceDeclaredValue, setInsuranceDeclaredValue] = useState(0);
  const [insuranceRatePercent, setInsuranceRatePercent] = useState(3);

  // Other & Discounts
  const [otherCharges, setOtherCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(18); // 0, 5, 18

  const [createQuote, { isLoading: saving }] = useCreateQuoteMutation();

  // Calculations
  const insuranceCharges = Math.round(
    ((Number(insuranceDeclaredValue) || 0) * (Number(insuranceRatePercent) || 0)) / 100
  );

  const subtotal =
    (Number(packagingCharges) || 0) +
    (Number(transportCharges) || 0) +
    (Number(loadingCharges) || 0) +
    (Number(unloadingCharges) || 0) +
    insuranceCharges +
    (Number(otherCharges) || 0) -
    (Number(discount) || 0);

  const gstAmount = Math.round(((Math.max(0, subtotal)) * (Number(gstRate) || 0)) / 100);
  const totalAmount = Math.max(0, subtotal + gstAmount);

  const totalCFT = selectedItems.reduce((acc, item) => acc + (item.cft * item.qty), 0);

  const handleAddItem = (preset) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.name === preset.name);
      if (existing) {
        return prev.map((i) =>
          i.name === preset.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { name: preset.name, qty: 1, cft: preset.cft || 5 }];
    });
  };

  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;
    setSelectedItems((prev) => [
      ...prev,
      { name: customItemName.trim(), qty: 1, cft: 10 },
    ]);
    setCustomItemName("");
  };

  const handleRemoveItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQtyChange = (index, delta) => {
    setSelectedItems((prev) =>
      prev
        .map((item, i) => {
          if (i === index) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !movingFrom || !movingTo) {
      alert("Please fill in customer details and moving locations.");
      return;
    }

    try {
      const payload = {
        leadId: leadId ? Number(leadId) : undefined,
        customerName,
        customerPhone,
        movingFrom,
        movingTo,
        moveDate: moveDate || undefined,
        inventoryData: JSON.stringify(selectedItems),
        packagingCharges: Number(packagingCharges) || 0,
        transportCharges: Number(transportCharges) || 0,
        loadingCharges: Number(loadingCharges) || 0,
        unloadingCharges: Number(unloadingCharges) || 0,
        insuranceDeclaredValue: Number(insuranceDeclaredValue) || 0,
        insuranceRatePercent: Number(insuranceRatePercent) || 0,
        insuranceCharges,
        otherCharges: Number(otherCharges) || 0,
        discount: Number(discount) || 0,
        gstRate: Number(gstRate) || 0,
        gstAmount,
        totalAmount,
      };

      const res = await createQuote(payload).unwrap();
      navigate(`/quotes/${res.quote.id}`);
    } catch (err) {
      alert("Failed to create quotation: " + (err.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Top Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Quotation</h2>
          <p className="text-xs text-slate-500">Estimate builder with inventory & GST pricing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer & Route Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Customer & Move Route</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer full name"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Phone *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit phone"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moving From (Pickup City / Address) *
              </label>
              <input
                type="text"
                required
                value={movingFrom}
                onChange={(e) => setMovingFrom(e.target.value)}
                placeholder="e.g. Ranchi, Jharkhand"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moving To (Drop City / Address) *
              </label>
              <input
                type="text"
                required
                value={movingTo}
                onChange={(e) => setMovingTo(e.target.value)}
                placeholder="e.g. Patna, Bihar"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Moving Date
              </label>
              <input
                type="date"
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Goods Inventory Selector Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-amber-500" />
              <span>Goods Inventory & Volume</span>
            </h3>
            {totalCFT > 0 && (
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                ~{totalCFT} CFT volume
              </span>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Tap to add common items:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => handleAddItem(item)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs rounded-lg transition-colors border border-slate-200 cursor-pointer"
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom item input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              placeholder="Or type custom item name..."
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Added items list */}
          {selectedItems.length > 0 && (
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 text-xs">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, -1)}
                        className="px-2 py-0.5 bg-slate-50 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, 1)}
                        className="px-2 py-0.5 bg-slate-50 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Estimation Breakdown Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Moving Charges Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Freight / Transport (₹)
              </label>
              <input
                type="number"
                value={transportCharges}
                onChange={(e) => setTransportCharges(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Packing Material & Labor (₹)
              </label>
              <input
                type="number"
                value={packagingCharges}
                onChange={(e) => setPackagingCharges(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Loading Charges (₹)
              </label>
              <input
                type="number"
                value={loadingCharges}
                onChange={(e) => setLoadingCharges(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Unloading & Placement (₹)
              </label>
              <input
                type="number"
                value={unloadingCharges}
                onChange={(e) => setUnloadingCharges(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Declared Goods Value for Insurance (₹)
              </label>
              <input
                type="number"
                value={insuranceDeclaredValue}
                onChange={(e) => setInsuranceDeclaredValue(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
              <span className="text-[10px] text-slate-400">
                Premium: {insuranceRatePercent}% = ₹{insuranceCharges}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Discount (₹)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
              />
            </div>
          </div>

          {/* GST Selection */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">GST Rate:</span>
            <div className="flex gap-2">
              {[0, 5, 18].map((rate) => (
                <button
                  type="button"
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    gstRate === rate
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {rate}% {rate === 18 ? "(Composite)" : rate === 5 ? "(GTA)" : "(Non-GST)"}
                </button>
              ))}
            </div>
          </div>

          {/* Total Calculation Display */}
          <div className="bg-slate-900 text-white rounded-xl p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {gstRate > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>GST ({gstRate}%):</span>
                <span className="font-mono">₹{gstAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-amber-400 pt-1 border-t border-slate-800">
              <span>Estimated Total:</span>
              <span className="font-mono">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? "Generating Quote..." : "Generate & Preview Formal Quote"}
        </button>
      </form>
    </div>
  );
};

export default QuoteBuilder;
