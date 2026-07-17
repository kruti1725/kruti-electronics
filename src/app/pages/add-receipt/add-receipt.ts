import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ApiService } from '../../services/api';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-add-receipt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Navbar
  ],
  templateUrl: './add-receipt.html',
  styleUrls: ['./add-receipt.scss']
})
export class AddReceipt implements OnInit {

  @ViewChild('serialInput')
  serialInput!: ElementRef<HTMLInputElement>;

  receiptForm!: FormGroup;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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

  initializeForm(): void {

    const today = new Date().toISOString().substring(0,10);

    this.receiptForm = this.fb.group({

      serialNumber: ['', Validators.required],

      customerName: ['', Validators.required],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      receivedDate: [today],

      repairBy: [''],

      brand: ['', Validators.required],

      modelNumber:[''],

      complaint: [''],

      estimatedCost: [null],

      cost: [null],

      status: ['Pending'],

      priority: ['Normal'],

      rackNo: [''],

      paymentMethod: ['Pending'],

      remarks: ['']

    });

  }

  saveReceipt(): void {

    if(this.receiptForm.invalid){

      this.receiptForm.markAllAsTouched();

      alert("Please fill all required fields.");

      return;

    }

    this.loading = true;

    const form = this.receiptForm.value;

    const data = {

      serialNumber: form.serialNumber,

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

    console.log(data);

    this.api.addReceipt(data).subscribe({

     next:(res:any)=>{

    this.loading = false;

    this.openWhatsApp(form);

    alert("✅ Receipt Saved Successfully");

    this.resetForm();

},
      error:(err)=>{

        this.loading = false;

        console.log(err);

        if(err.status===400){

          alert("❌ Serial Number already exists.");

        }

        else{

          alert("❌ Unable to Save Receipt.");

        }

      }

    });

  }

  resetForm(): void {

    const today = new Date().toISOString().substring(0,10);

   this.receiptForm.reset({

receivedDate: today,

status: 'Pending',

priority: 'Normal',

paymentMethod: 'Pending'

});

    setTimeout(()=>{

      this.serialInput.nativeElement.focus();

    },100);

  }

  openWhatsApp(form: any): void {

const message =
`📺 *KRUTI ELECTRONICS*

━━━━━━━━━━━━━━━━━━━━━━

🧾 *TV REPAIR RECEIPT*

Receipt No : ${form.serialNumber}

Customer : ${form.customerName}

Mobile : ${form.mobileNumber}

Brand : ${form.brand}

Model No : ${form.modelNumber || "-"}

Status : ${form.status}

━━━━━━━━━━━━━━━━━━━━━━

🔍 Check Repair Status

https://kruti-electronics.netlify.app/search-receipt?serial=${form.serialNumber}

━━━━━━━━━━━━━━━━━━━━━━

📢 *Important Notice*

• Please collect your repaired product within 20 days.

• After 20 days, storage charge ₹300/day.

• If the product is not collected within 30 days, it may be treated as scrap and the shop will not be responsible.

━━━━━━━━━━━━━━━━━━━━━━

🙏 Thank You

*KRUTI ELECTRONICS*`;

const url =
`https://wa.me/91${form.mobileNumber}?text=${encodeURIComponent(message)}`;

window.open(url, "_blank");

}
}
