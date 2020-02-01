import { FavoriteInterface } from './../models/favorite-interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductInterface, ProductProdInterface } from './../models/product-interface';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private productProd: ProductProdInterface = {};
  private products: any[] = [];

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authService.getToken()
  });

  getAllProducts(): Observable<ProductInterface[]> {
    const url_api = 'http://localhost:3000/api/products';
    return this.http.get<ProductInterface[]>(url_api);
  }

  getAllProductsByAttribute(attribute: string, equal: any): Observable<ProductInterface[]> {
    const url_api = `http://localhost:3000/api/products?filter[where][${attribute}]=${equal}`;
    return this.http.get<ProductInterface[]>(url_api);
  }

  getCountProducts(category: string): Observable<any>{
    const url_api = `http://localhost:3000/api/products/count?where[category]=${category}`;
    return this.http.get<any>(url_api);
  }

  getProductsFavorites(favorites: FavoriteInterface[]): Observable<ProductInterface[]> {
    // let products: ProductInterface[] = [];
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

  getProductById(id: string): Observable<ProductProdInterface> {
    const url_api = `http://localhost:3000/api/products/${id}`;
    return this.http.get<ProductProdInterface>(url_api);
  }
  

  saveProduct(product: ProductInterface): Observable<ProductProdInterface> {
    //TODO: get token
    this.prepareProduct(product);
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/products?access_token=${token}`;
    return this.http.post<ProductProdInterface>(url_api, this.productProd , { headers: this.headers });
  }

  updateProduct(product: ProductInterface): Observable<ProductProdInterface> {
    //TODO: get token
    this.prepareProduct(product);
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/products/${this.productProd.id}/?access_token=${token}`;
    return this.http.put<ProductProdInterface>(url_api, this.productProd, { headers: this.headers }).pipe(map(data => data))
  }

  deleteProduct(id: string) {
    //TODO: get token
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/products/${id}?access_token=${token}`;
    return this.http.delete(url_api, { headers: this.headers }).pipe(map(data => data));
  }

  private prepareProduct(product: ProductInterface){
    this.productProd.id = product.id;
    this.productProd.code = product.code;
    this.productProd.category = product.category;
    this.productProd.name = product.name;
    this.productProd.size = product.size;
    this.productProd.description = product.description;
    this.productProd.applications = product.applications;
    this.productProd.price = product.price;
    this.productProd.units = product.units;
    this.productProd.image = product.image;
    this.productProd.available = product.available;
    this.productProd.boxCapacity = product.boxCapacity;
    this.productProd.bestSeller = product.bestSeller;
  }
}
