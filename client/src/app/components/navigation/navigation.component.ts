import { UserInterface } from './../../models/user-interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './../user/login/login.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private authService: AuthService) { }

  @ViewChild(LoginComponent)
  loginComponent: LoginComponent;

  public isLogin:boolean = false;
  public isAdmin:boolean = false;
  public user:UserInterface;

  ngOnInit() {
    this.getCurrentUser();
  }

  onLogin(): void{
    this.loginComponent.openModal();
  }

  getCurrentUser(): void{
    if(this.authService.getCurrentUser() != null){
      this.user = this.authService.getCurrentUser();
      this.isLogin = true;
      if(this.user.type === "admin" || this.user.type === "super admin"){
        this.isAdmin = true;
      }
    }
  }

  onLogout():void {
    this.authService.logoutUser().subscribe(data => data);
    location.reload();
  }

}