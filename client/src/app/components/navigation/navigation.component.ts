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

  ngOnInit() {
    this.currentUser();
  }

  onLogin(){
    this.loginComponent.openModal();
  }

  currentUser(){
    if(this.authService.getCurrentUser() != null){
      this.isLogin = true;
    }
  }

  onLogout():void {
    this.authService.logoutUser().subscribe(data => data);
    location.reload();
  }

}