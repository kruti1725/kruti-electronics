import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { Dashboard } from './pages/dashboard/dashboard';
import { AddReceipt } from './pages/add-receipt/add-receipt';
import { SearchReceipt } from './pages/search-receipt/search-receipt';
import { UpdateReceipt } from './pages/update-receipt/update-receipt';
import { AllReceipts } from './pages/all-receipts/all-receipts';
import { Login } from './pages/login/login';

export const routes: Routes = [

{
  path:'',
  redirectTo:'search-receipt',
  pathMatch:'full'
},

{
  path:'search-receipt',
  component:SearchReceipt
},

{
  path:'kruti-admin-login-92731',
  component:Login
},

{
path:'dashboard',
component:Dashboard,
canActivate:[authGuard]
},

{
path:'add-receipt',
component:AddReceipt,
canActivate:[authGuard]
},

{
path:'all-receipts',
component:AllReceipts,
canActivate:[authGuard]
},

{
path:'update-receipt/:serialNumber',
component:UpdateReceipt,
canActivate:[authGuard]
},
{
  path:'**',
  redirectTo:'search-receipt'
}

];
