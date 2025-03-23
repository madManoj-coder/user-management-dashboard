import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';


const routes: Routes = [
    { path: '', component: UserListComponent },
    // { path: 'add', component: UserFormComponent },
    { path: 'details/:id', component: UserDetailsComponent },
    // { path: 'create', component: UserFormComponent },
    // { path: 'edit/:id', component: UserFormComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
