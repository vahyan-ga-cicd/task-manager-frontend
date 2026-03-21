import React, { useState } from "react";
import { X, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { InvoiceCreate, Trip } from "@/@types/interface/invoice.interface";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceCreate) => Promise<void>;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InvoiceCreate>({
    bill_to_name: "",
    address: "",
    gst_no: "",
    pan_no: "",
    place_of_supply: "",
    hsn_code: "",
    received_amount: 0,
    trips: [
      {
        no_of_trips: 0,
        total_freight_amount: 0,
        total_charges: 0,
        total_deduction: 0,
      },
    ],
  });

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTripChange = (
    index: number,
    field: keyof Trip,
    value: string | number,
  ) => {
    const newTrips = [...formData.trips];
    newTrips[index] = { ...newTrips[index], [field]: Number(value) };
    setFormData((prev) => ({ ...prev, trips: newTrips }));
  };

  const addTrip = () => {
    setFormData((prev) => ({
      ...prev,
      trips: [
        ...prev.trips,
        {
          no_of_trips: 0,
          total_freight_amount: 0,
          total_charges: 0,
          total_deduction: 0,
        },
      ],
    }));
  };

  const removeTrip = (index: number) => {
    if (formData.trips.length === 1) return;
    const newTrips = formData.trips.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, trips: newTrips }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
      alert(
        "Failed to create invoice. Please check the details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Create New Invoice
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all bg-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-8 overflow-y-auto max-h-[70vh]"
        >
          {/* Client Details */}
          <section>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Client Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Client Name
                </label>
                <input
                  required
                  name="bill_to_name"
                  value={formData.bill_to_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  GST Number
                </label>
                <input
                  required
                  name="gst_no"
                  value={formData.gst_no}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  PAN Number
                </label>
                <input
                  required
                  name="pan_no"
                  value={formData.pan_no}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Place of Supply
                </label>
                <input
                  required
                  name="place_of_supply"
                  value={formData.place_of_supply}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Address
                </label>
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none h-20"
                />
              </div>
            </div>
          </section>

          {/* Invoice Details */}
          <section>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Invoice Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  HSN Code
                </label>
                <input
                  required
                  name="hsn_code"
                  value={formData.hsn_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Received Amount (₹)
                </label>
                <input
                  type="number"
                  name="received_amount"
                  value={
                    formData.received_amount === 0
                      ? ""
                      : formData.received_amount
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      received_amount:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    }))
                  }
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Trip Items */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Trip Items
              </h4>
              <button
                type="button"
                onClick={addTrip}
                className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" /> Add Trip
              </button>
            </div>
            <div className="space-y-4">
              {formData.trips.map((trip, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Trips Qty
                      </label>
                      <input
                        type="number"
                        value={trip.no_of_trips === 0 ? "" : trip.no_of_trips}
                        onChange={(e) =>
                          handleTripChange(index, "no_of_trips", e.target.value)
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Freight Amount
                      </label>
                      <input
                        type="number"
                        value={
                          trip.total_freight_amount === 0
                            ? ""
                            : trip.total_freight_amount
                        }
                        onChange={(e) =>
                          handleTripChange(
                            index,
                            "total_freight_amount",
                            e.target.value,
                          )
                        }
                        placeholder="Enter amount"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Extra Charges
                      </label>
                      <input
                        type="number"
                        value={
                          trip.total_charges === 0 ? "" : trip.total_charges
                        }
                        onChange={(e) =>
                          handleTripChange(
                            index,
                            "total_charges",
                            e.target.value,
                          )
                        }
                        placeholder="Enter charges"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Deduction
                      </label>
                      <input
                        type="number"
                        value={
                          trip.total_deduction === 0 ? "" : trip.total_deduction
                        }
                        onChange={(e) =>
                          handleTripChange(
                            index,
                            "total_deduction",
                            e.target.value,
                          )
                        }
                        placeholder="Enter deduction"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                  {formData.trips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTrip(index)}
                      className="absolute -top-2 -right-2 p-1.5 bg-white border border-red-100 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </form>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all font-sans"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 font-sans"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
