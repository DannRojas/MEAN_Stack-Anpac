import { AdministratorInterface } from './../models/administrator-interface';
import { ClientInterface } from './../models/client-interface';
import { Injectable } from '@angular/core';
import { UserInterface } from '../models/user-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-type": "application/json"
  })

  // headers1: HttpHeaders = new HttpHeaders({
  //   "Content-type": "application/json",
  //   Authorization: this.getToken()
  // })

  createUser(user: UserInterface): Observable<any>{
    let accessToken = localStorage.getItem('accessToken');
    const url_api = `http://localhost:3000/api/users?access_token=${accessToken}`;
    return this.http.post<UserInterface>(
      url_api,
      {
        type: user.type,
        username: user.username,
        email: user.email,
        password: user.password
      },
      { headers:this.headers }
    ).pipe(map(data => data));
  }

  loginUser(username: string, password: string): Observable<any>{
    const url_api = "http://localhost:3000/api/users/login?include=user";
    return this.http.post<UserInterface>(
      url_api,
      {
        username: username,
        password: password
      },
      {headers: this.headers
      }).pipe(map(data => data));
  }

  logoutUser():Observable<any> {
    let accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    const url_api = `http://localhost:3000/api/users/logout?access_token=${accessToken}`;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    return this.http.post<UserInterface>(url_api, {headers: this.headers});
  }

  setUser(user: UserInterface):void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setToken(token):void {
    localStorage.setItem('accessToken', token);
  }

  getToken():string {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser():UserInterface {
    let user_string = localStorage.getItem('currentUser');
    if(!isNullOrUndefined(user_string)){
      let user: UserInterface = JSON.parse(user_string);
      return user;
    }else{
      return null;
    }
  }

  getUserClient(): Observable<ClientInterface>{
    let accessToken = this.getToken();
    let user: UserInterface = this.getCurrentUser();
    const url_api = `http://localhost:3000/api/users/${user.id}/client?access_token=${accessToken}`;
    return this.http.get<ClientInterface>(url_api, {headers: this.headers});
  }

  getUserAdmin(): Observable<AdministratorInterface>{
    let accessToken = localStorage.getItem('accessToken');
    let user: UserInterface = this.getCurrentUser();
    const url_api = `http://localhost:3000/api/users/${user.id}/admin?access_token=${accessToken}`;
    return this.http.get<AdministratorInterface>(url_api, {headers: this.headers});
  }

}