import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

import { Navbar } from '../../components/navbar/navbar';
import { ApiService } from '../../services/api';

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-all-receipts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Navbar
  ],
  templateUrl: './all-receipts.html',
  styleUrls: ['./all-receipts.scss']
})
export class AllReceipts implements OnInit {

  @ViewChild('printSection')
  printSection!: ElementRef;

  selectedReceipt: any = null;
  qrCode = "";

  receipts: any[] = [];
  filteredReceipts: any[] = [];

  loading = false;
  searchText = '';
  priorityFilter = '';
  daysFilter = '';
  statusFilter = 'All';

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReceipts();
  }

  exportExcel() {

  const data = this.receipts.map((r:any)=>({

    "Receipt No": r.serialNumber,

    "Customer": r.customerName,

    "Mobile": r.mobileNumber,

    "Brand": r.tvs[0]?.brand,

    "Model": r.tvs[0]?.modelNumber,

    "Repair By": r.repairBy,

    "Priority": r.tvs[0]?.priority,

    "Rack No": r.tvs[0]?.rackNo,

    "Payment": r.tvs[0]?.paymentMethod,

    "Estimated Cost": r.tvs[0]?.estimatedCost,

    "Actual Cost": r.tvs[0]?.cost,

    "Status": r.tvs[0]?.status,

    "Received Date": r.receivedDate,

    "Remarks": r.remarks

  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Receipts"
  );

  XLSX.writeFile(
  workbook,
  `Receipts_${new Date().toISOString().substring(0,10)}.xlsx`
);

}

  // ===============================
  // Load Receipts
  // ===============================

  loadReceipts(): void {

    this.loading = true;

    this.api.getAllReceipts().subscribe({

      next: (res: any) => {

        this.receipts = res.data || [];

        console.log(this.receipts);

        this.filteredReceipts = [...this.receipts];

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (err: any) => {

        console.log(err);

        this.loading = false;

        alert("Unable to Load Receipts");

      }

    });

  }

  // ===============================
  // Search
  // ===============================

 filterReceipts(): void {

const value=this.searchText.toLowerCase().trim();

this.filteredReceipts=this.receipts.filter((receipt:any)=>{

const serial=receipt.serialNumber?.toLowerCase() || '';

const customer=receipt.customerName?.toLowerCase() || '';

const mobile=receipt.mobileNumber?.toLowerCase() || '';

const brand=receipt.tvs?.[0]?.brand?.toLowerCase() || '';

const priority=receipt.tvs?.[0]?.priority || '';

const status = receipt.tvs?.[0]?.status || '';

const days=this.getDays(receipt.receivedDate);

const matchesSearch=

serial.includes(value) ||

customer.includes(value) ||

mobile.includes(value) ||

brand.includes(value);

const matchesPriority=

!this.priorityFilter ||

priority===this.priorityFilter;

const matchesStatus =

!this.statusFilter ||

this.statusFilter === 'All' ||

status === this.statusFilter;

let matchesDays=true;

if(this.daysFilter==='0-3'){

matchesDays=days<=3;

}

if(this.daysFilter==='4+'){

matchesDays=days>=4;

}

return matchesSearch &&
       matchesPriority &&
       matchesDays &&
       matchesStatus;

});

}

  // ===============================
// Days Since Receipt
// ===============================

getDays(receivedDate: any): number {

  if (!receivedDate) return 0;

  const received = new Date(receivedDate);

  if (isNaN(received.getTime())) return 0;

  const today = new Date();

  today.setHours(0,0,0,0);
  received.setHours(0,0,0,0);

  const diff = today.getTime() - received.getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24));

}

// ===============================
// Old Receipt Highlight
// ===============================

isOldReceipt(receipt:any){

const days=this.getDays(receipt.receivedDate);

return days>=4 &&
receipt.tvs?.[0]?.status!=="Delivered";

}

// ===============================
// Priority Badge
// ===============================

getPriorityClass(priority: string): string {

  switch (priority) {

    case 'Urgent':
      return 'bg-danger';

    case 'High':
      return 'bg-warning text-dark';

    default:
      return 'bg-success';

  }

}


  // ===============================
  // Update
  // ===============================

  updateReceipt(serialNumber: string): void {

    this.router.navigate([
      '/update-receipt',
      serialNumber
    ]);

  }

  // ===============================
  // Delete
  // ===============================

  deleteReceipt(serialNumber: string): void {

    if (!confirm("Delete this receipt?")) {
      return;
    }

    this.api.deleteReceipt(serialNumber)
    .subscribe({

      next: () => {

        alert("Receipt Deleted Successfully");

        this.loadReceipts();

      },

      error: (err: any) => {

        console.log(err);

        alert("Unable to Delete Receipt");

      }

    });

  }

  // ===============================
  // PRINT
  // ===============================

  printReceipt(receipt: any): void {

  this.selectedReceipt = receipt;

  QRCode.toDataURL(
  `https://kruti-electronics.netlify.app/search-receipt?serial=${receipt.serialNumber}`
).then((url: string) => {

  this.qrCode = url;

  this.cdr.detectChanges();

}).catch((err: any) => {

  console.error(err);

});

    this.cdr.detectChanges();

    setTimeout(() => {

      const printContents =
        this.printSection.nativeElement.innerHTML;

      const popup = window.open(
        '',
        '_blank',
        'width=900,height=800'
      );

      if (!popup) return;

      popup.document.open();

      popup.document.write(`

      <html>

      <head>

      <title>Receipt</title>

      <style>

      body{

        font-family:Arial;

        padding:30px;

      }

      h2,h3{

        text-align:center;

      }

      table{

        width:100%;

        border-collapse:collapse;

        margin-top:20px;

      }

      td{

        border:1px solid #000;

        padding:10px;

      }

      </style>

      </head>

      <body>

      ${printContents}

      </body>

      </html>

      `);

      popup.document.close();

      popup.onload = () => {

        popup.focus();

        popup.print();

        popup.close();

      };

    }, 200);

  }

  // ===============================
  // PDF DOWNLOAD
  // ===============================

  async downloadPDF(receipt: any): Promise<void> {

    this.selectedReceipt = receipt;
    QRCode.toDataURL(
  `https://kruti-electronics.netlify.app/search-receipt?serial=${receipt.serialNumber}`
).then((url: string) => {

  this.qrCode = url;

  this.cdr.detectChanges();

}).catch((err: any) => {

  console.error(err);

});

    this.cdr.detectChanges();

    await new Promise(resolve =>
      setTimeout(resolve, 300)
    );

    const DATA =
      this.printSection.nativeElement;

    const canvas =
      await html2canvas(DATA, {

        scale: 2,

        useCORS: true

      });

    const imgData =
      canvas.toDataURL('image/png');

    const pdf =
      new jsPDF('p', 'mm', 'a4');

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const imgHeight =
      canvas.height * pageWidth / canvas.width;

    pdf.addImage(

      imgData,

      'PNG',

      0,

      0,

      pageWidth,

      imgHeight

    );

    pdf.save(

      `Receipt-${receipt.serialNumber}.pdf`

    );

  }


  confirmReceived(serial:string){

this.api.confirmReceived(serial)

.subscribe({

next:()=>{

this.loadReceipts();

},

error:()=>{

alert("Unable To Update");

}

});

}



}
