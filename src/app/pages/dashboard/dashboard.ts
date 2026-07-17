import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../services/api';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Navbar
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  dashboard = {
    totalReceipts: 0,
    totalTVs: 0,
    pending: 0,
    underRepair: 0,
    ready: 0,
    delivered: 0
  };

  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('Dashboard Component Loaded');
  }

  ngOnInit(): void {
    console.log('ngOnInit Called');
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading = true;
    this.error = '';

    console.log('Calling Dashboard API...');

    this.api.getDashboard().subscribe({

      next: (res: any) => {

        console.log('API Response:', res);

        if (!res || !res.success || !res.data) {

          this.loading = false;
          this.error = 'Invalid API Response';

          return;

        }

        this.dashboard = {

          totalReceipts: Number(res.data.totalReceipts ?? 0),

          totalTVs: Number(res.data.totalTVs ?? 0),

          pending: Number(res.data.pending ?? 0),

          underRepair: Number(res.data.underRepair ?? 0),

          ready: Number(res.data.ready ?? 0),

          delivered: Number(res.data.delivered ?? 0)

        };

        console.log('Dashboard Updated:', this.dashboard);

        this.cdr.detectChanges();

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.error = 'Unable to load dashboard';

      }

    });

  }

  refreshDashboard(): void {

    this.loadDashboard();

  }

}
