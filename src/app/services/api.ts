import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://kruti-electronics-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  // ===============================
  // Dashboard
  // ===============================

  getDashboard() {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // ===============================
  // Add Receipt
  // ===============================

  addReceipt(data: any) {
    return this.http.post(`${this.apiUrl}/add-receipt`, data);
  }

  // ===============================
  // All Receipts
  // ===============================

  getAllReceipts() {
    return this.http.get(`${this.apiUrl}/receipts`);
  }

  // ===============================
  // Get Receipt By Serial Number
  // ===============================

  getReceiptBySerial(serialNumber: string) {
    return this.http.get(`${this.apiUrl}/receipt/${serialNumber}`);
  }

  // ===============================
  // Get Receipt By Mobile Number
  // ===============================

  getReceiptByMobile(mobile: string) {
    return this.http.get(`${this.apiUrl}/mobile/${mobile}`);
  }

  // ===============================
  // Update Receipt
  // ===============================

  updateReceipt(serialNumber: string, data: any) {
    return this.http.put(
      `${this.apiUrl}/update-receipt/${serialNumber}`,
      data
    );
  }

  // ===============================
  // Delete Receipt
  // ===============================

  deleteReceipt(serialNumber: string) {
    return this.http.delete(
      `${this.apiUrl}/delete-receipt/${serialNumber}`
    );
  }

    // ===============================
  // Customer Received
  // ===============================

  customerReceived(serial: string) {

  return this.http.put(

    `${this.apiUrl}/customer-received/${serial}`,

    {}

  );

}

  // ===============================
  // Confirm Received
  // ===============================
confirmReceived(serial: string) {

  return this.http.put(

    `${this.apiUrl}/confirm-received/${serial}`,

    {}

  );

}


}
