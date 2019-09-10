import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      if (this.validateForm.controls[i].invalid) {
        return;
      }
    }
    this.loginService.login(this.validateForm.value.username, this.validateForm.value.password)
      .subscribe(result => this.loginSuccess(result));
  }
  loginSuccess(result: any) {
    console.log('result: ' + JSON.stringify(result));
    const data = result.data;
    const token = data.token;
    const username = data.username;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('username', username);
    this.router.navigate(['/home']);
  }

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.validateForm = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['qwertyuiop', [Validators.required]],
      remember: [true]
    });
  }
}
