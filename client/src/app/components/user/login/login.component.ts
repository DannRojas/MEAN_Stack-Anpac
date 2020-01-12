import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService) { }

  @ViewChild('btnOpen') btnOpen: ElementRef;

  hidePassword: boolean = true;
  loginForm: FormGroup;

  isError:boolean = false;

  ngOnInit() {
    this.validations();
  }

  openModal() {
    this.onReset();
    this.isError = false;
    this.btnOpen.nativeElement.click();
  }

  validations(): void {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      userPassword: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  get userName() { return this.loginForm.get('userName'); }
  get userPassword() { return this.loginForm.get('userPassword'); }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }


  onLogin() {
    if (this.loginForm.valid) {
      let userName:string = this.loginForm.value.userName.toLowerCase();
      let userPassword:string = this.loginForm.value.userPassword.toLowerCase();
      return this.authService.loginUser(userName, userPassword).subscribe(data => {
        this.authService.setUser(data.user);
        const token = data.id;
        this.authService.setToken(token);
        location.reload();
      },
        error => this.isError = true
      )
    }
  }

  onReset() {
    this.loginForm.reset();
  }

}