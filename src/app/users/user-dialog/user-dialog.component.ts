import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.inteface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  userForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) { }

  ngOnInit(): void {
    // Initialize Form
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['', Validators.required],
      address: ['', Validators.required]
    });

    // **If Editing, Patch Data**
    if (this.data?.user) {
      this.isEditMode = true;
      this.userForm.patchValue(this.data.user);
    }
  }

  /** ✅ Submit Form */
  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;

      if (this.isEditMode) {
        this.userService.updateUser(this.data.user!.id!, userData).subscribe(() => {
          Swal.fire('User Updated!', 'User details have been updated.', 'success');
          this.dialogRef.close(true); // Close Dialog with Success Flag
        });
      } else {
        this.userService.createUser(userData).subscribe(() => {
          Swal.fire('User Added!', 'New user has been created.', 'success');
          this.dialogRef.close(true);
        });
      }
    }
  }

  /** Close Dialog */
  onCancel(): void {
    this.dialogRef.close();
  }

}
