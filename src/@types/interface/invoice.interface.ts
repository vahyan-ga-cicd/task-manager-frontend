export interface Trip {
  no_of_trips: number;
  total_freight_amount: number;
  total_charges: number;
  total_deduction: number;
  total_amount?: number;
}
export interface InvoiceCreate {
  bill_to_name: string;
  address: string;
  gst_no: string;
  pan_no: string;
  place_of_supply: string;
  hsn_code: string;
  trips: Trip[];
  received_amount: number;
}
export interface InvoiceResponse extends InvoiceCreate {
  invoice_no: string;
  date: string;
  due_date: string;
  total_invoice_amount: number;
  cgst: number;
  sgst: number;
  balance: number;
  amount_in_words: string;
  creator_name: string;
  creator_phone: string;
  total_amount_before_tax: number;
  total_deductions: number;
}