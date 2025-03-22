import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.inteface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEditMode = false;
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      role: ['User', Validators.required]
    });

    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.isEditMode = true;
      this.userService.getUserById(this.userId).subscribe(user => {
        this.userForm.patchValue(user);
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;
      if (this.isEditMode) {
        this.userService.updateUser(this.userId, userData).subscribe(() => {
          Swal.fire({
            title: 'User Updated!',
            text: 'The user details have been successfully updated.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/users']);
          });
        });
      } else {
        this.userService.createUser(userData).subscribe(() => {
          Swal.fire({
            title: 'User Added!',
            text: 'The new user has been successfully added.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/users']);
          });
        });
      }
    }
  }

}
