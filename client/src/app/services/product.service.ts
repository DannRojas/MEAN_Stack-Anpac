import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductInterface } from './../models/product-interface';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public selectedProduct: ProductInterface = {};
  // private product: Observable<any>;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authService.getToken()
  });

  getAllProducts(): Observable<ProductInterface[]>{
    const url_api = 'http://localhost:3000/api/products';
    return this.http.get<ProductInterface[]>(url_api);
  }

  getProductById(id: string): Observable<ProductInterface>{
    const url_api = `http://localhost:3000/api/products/${id}`;
    return this.http.get<ProductInterface>(url_api);
  }

  saveProduct(product: ProductInterface): Observable<ProductInterface>{
    //TODO: get token
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/products?access_token=${token}`;
    return this.http.post<ProductInterface>(url_api, product, { headers: this.headers });
  }

  updateProduct(product: ProductInterface){
    //TODO: get token
    const token = this.authService.getToken();
    const productId = product.id;
    const url_api = `http://localhost:3000/api/products/${productId}/?access_token=${token}`;
    return this.http.put<ProductInterface>(url_api, product, { headers: this.headers }).pipe(map(data =>data))
  }

  deleteProduct(id: string){
    //TODO: get token
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/products/${id}/?access_token=${token}`;
    return this.http.delete<ProductInterface>(url_api, {headers: this.headers}).pipe(map(data => data));
  }
}
