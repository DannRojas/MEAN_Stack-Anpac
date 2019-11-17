import { UserInterface } from './../models/user-interface';
import { Injectable } from '@angular/core';
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

  registerUser(username: string, email: string, password): Observable<any>{
    const url_api = "http:/localhost:3000/api/Users";
    return this.http.post<UserInterface>(
      url_api,
      {
        username: name,
        email: email,
        password: password
      },
      { headers:this.headers }
    ).pipe(map(data => data));
  }

  loginUser(username: string, password: string): Observable<any>{
    const url_api = "http://localhost:3000/api/Users/login?include=user";
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
    console.log(accessToken)
    const url_api = `http://localhost:3000/api/Users/logout?access_token=${accessToken}`;
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
    return localStorage.getItem("accessToker");
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
}
