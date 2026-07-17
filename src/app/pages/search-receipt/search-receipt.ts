import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomerNavbar } from '../../components/customer-navbar/customer-navbar';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-search-receipt',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomerNavbar
  ],
  templateUrl: './search-receipt.html',
  styleUrls: ['./search-receipt.scss']
})
export class SearchReceipt {

  searchValue = '';

  receipts: any[] = [];

  loading = false;

  searched = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  searchReceipt(): void {

    if (!this.searchValue.trim()) {

      alert("Please Enter Serial Number or Mobile Number");

      return;

    }

    this.loading = true;

    this.searched = false;

    this.receipts = [];

    const value = this.searchValue.trim();

    const request = /^[0-9]{10}$/.test(value)
      ? this.api.getReceiptByMobile(value)
      : this.api.getReceiptBySerial(value);

    request.subscribe({

      next: (res: any) => {

        if (Array.isArray(res.data)) {

          this.receipts = [...res.data];

        } else if (res.data) {

          this.receipts = [res.data];

        }

        this.loading = false;

        this.searched = true;

        this.cdr.detectChanges();

      },

      error: () => {

        this.loading = false;

        this.searched = true;

        this.receipts = [];

        this.cdr.detectChanges();

      }

    });

  }

  customerReceived(serial:string){

this.api.customerReceived(serial)

.subscribe({

next:()=>{

alert("Request Sent Successfully");

this.searchReceipt();

},

error:()=>{

alert("Unable To Send Request");

}

});

}

}
