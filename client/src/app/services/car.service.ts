import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarProductInterface } from '../models/carProduct-interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private carProducts: CarProductInterface[];

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authService.getToken()
  });

  getCarProductsByClient(clientId: string): Observable<CarProductInterface[]>{
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/carProducts?filter=[clientId]=${clientId}&access_token=${token}`;
    return this.http.get<CarProductInterface[]>(url_api, {headers: this.headers});
  }

  getCountCarProductsByClient(clientId: string): Observable<any>{
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/carProducts?where[clientId]=${clientId}&access_token=${token}`;
    return this.http.get<any>(url_api, {headers: this.headers}).pipe(map(data => data));
  }

  saveCarProduct(carProduct: CarProductInterface): Observable<CarProductInterface>{
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/carProducts?access_token=${token}`;
    return this.http.post<CarProductInterface>(url_api, carProduct, {headers: this.headers});
  }

  updateCarProduct(carProduct: CarProductInterface): Observable<CarProductInterface> {
    //TODO: get token
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/carProducts/${carProduct.id}/?access_token=${token}`;
    return this.http.put<CarProductInterface>(url_api, carProduct, { headers: this.headers }).pipe(map(data => data));
  }

  deleteProduct(id: string) {
    //TODO: get token
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/carProducts/${id}?access_token=${token}`;
    return this.http.delete(url_api, { headers: this.headers }).pipe(map(data => data));
  }
  
}
