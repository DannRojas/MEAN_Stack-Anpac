import { FavoriteInterface } from './../models/favorite-interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductInterface } from './../models/product-interface';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public selectedProduct: ProductInterface = {};
  private products: any[] = [];

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authService.getToken()
  });



  getAllProducts(): Observable<ProductInterface[]> {
    const url_api = 'http://localhost:3000/api/products';
    return this.http.get<ProductInterface[]>(url_api);
  }

  getProductsFavorites(favorites: FavoriteInterface[]): Observable<ProductInterface[]> {
    let products: ProductInterface[] = [];
    for (let i = 0; i < favorites.length; i++) {
      this.getProductById(favorites[i].productId).subscribe(product => {
        this.products[i] = product;
      })
    }
    if(this.products.length>=0){
      console.log(this.products);
      return of<ProductInterface[]>(this.products);
    }
  }

  getProductById(id: string): Observable<ProductInterface> {
    const url_api = `http://localhost:3000/api/products/${id}`;
    return this.http.get<ProductInterface>(url_api);
  }

  saveProduct(product: ProductInterface): Observable<ProductInterface> {
    //TODO: get token
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/products?access_token=${token}`;
    return this.http.post<ProductInterface>(url_api, product, { headers: this.headers });
  }

  updateProduct(product: ProductInterface) {
    //TODO: get token
    const token = this.authService.getToken();
    const productId = product.id;
    const url_api = `http://localhost:3000/api/products/${productId}/?access_token=${token}`;
    return this.http.put<ProductInterface>(url_api, product, { headers: this.headers }).pipe(map(data => data))
  }

  deleteProduct(id: string) {
    //TODO: get token
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/products/${id}/?access_token=${token}`;
    return this.http.delete<ProductInterface>(url_api, { headers: this.headers }).pipe(map(data => data));
  }
}
