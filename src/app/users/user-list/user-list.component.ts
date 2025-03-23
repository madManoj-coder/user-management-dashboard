import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user.inteface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  users = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users.data = users;
      this.users.paginator = this.paginator;
      this.users.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.users.filter = filterValue;
  }

  deleteUser(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(() => {
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          this.fetchUsers();
        });
      }
    });
  }

  openEditDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user } // Pass user data if editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers(); // Refresh list after edit
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers(); // Refresh user list after adding a new user
      }
    });
  }

}
