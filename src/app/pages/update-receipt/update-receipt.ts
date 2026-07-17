import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-update-receipt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Navbar
  ],
  templateUrl: './update-receipt.html',
  styleUrls: ['./update-receipt.scss']
})
export class UpdateReceipt implements OnInit {

  receiptForm!: FormGroup;

  loading = false;

  serialNumber = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.initializeForm();

    this.serialNumber =
      this.route.snapshot.paramMap.get('serialNumber') || '';

    this.loadReceipt();

  }

  technicians = [
  'Prashant',
  'Manoj',
  'Swapnil',
  'Golu',
  'Rohit',
  'Ujjval',
  'Rakesh',
  'Bhavesh',
  'Durga Prasad',
  'Raju Bhai'
];

  initializeForm() {

    this.receiptForm = this.fb.group({

      customerName: ['', Validators.required],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      receivedDate: [''],

      repairBy: [''],

      brand: ['', Validators.required],

      modelNumber:[''],

      estimatedCost:[0],

      cost: [0], // ✅ Added

      complaint: [''],

      status: ['Pending'],

      priority: ['Normal'],

      rackNo: [''],

      paymentMethod: ['Pending'],

      remarks: ['']

    });

  }

  loadReceipt() {

    this.loading = true;

    this.api.getReceiptBySerial(this.serialNumber).subscribe({

      next: (res: any) => {

        this.loading = false;

        const receipt = res.data;

        this.receiptForm.patchValue({

          customerName: receipt.customerName,

          mobileNumber: receipt.mobileNumber,

          receivedDate: receipt.receivedDate
            ? receipt.receivedDate.substring(0, 10)
            : '',

          repairBy: receipt.repairBy,

          brand: receipt.tvs[0]?.brand,

          modelNumber:receipt.tvs[0]?.modelNumber,

          estimatedCost: receipt.tvs[0]?.estimatedCost || 0,

cost: receipt.tvs[0]?.cost || 0, // ✅ Added

          complaint: receipt.tvs[0]?.complaint,

          status: receipt.tvs[0]?.status,

          priority: receipt.tvs[0]?.priority || 'Normal',

          rackNo: receipt.tvs[0]?.rackNo || '',

          paymentMethod: receipt.tvs[0]?.paymentMethod || 'Pending',

          remarks: receipt.remarks

        });

      },

      error: (err) => {

        this.loading = false;

        console.log(err);

        alert("Receipt Not Found");

        this.router.navigate(['/all-receipts']);

      }

    });

  }

  updateReceipt() {

    if (this.receiptForm.invalid) {

      this.receiptForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    const form = this.receiptForm.value;

    const data = {

      customerName: form.customerName,

      mobileNumber: form.mobileNumber,

      receivedDate: form.receivedDate,

      repairBy: form.repairBy,

      remarks: form.remarks,

      tvs:[

{

brand: form.brand,

modelNumber: form.modelNumber,

estimatedCost: form.estimatedCost,

cost: form.cost,

complaint: form.complaint,

status: form.status,

priority: form.priority,

rackNo: form.rackNo,

paymentMethod: form.paymentMethod

}

]

    };
console.log("Form Value:", form);
console.log("Data Sending:", data);
    this.api.updateReceipt(this.serialNumber, data)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          alert("Receipt Updated Successfully");

          this.router.navigate(['/all-receipts']);

        },

        error: (err) => {

          this.loading = false;

          console.log(err);

          alert("Unable to Update Receipt");

        }

      });

  }

  cancel() {

    this.router.navigate(['/all-receipts']);

  }

}
