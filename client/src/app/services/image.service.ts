import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ProductInterface } from './../models/product-interface';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Http, ResponseContentType } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient, private http1: Http ,private authService: AuthService, private productService: ProductService) { }

  private images: any[];

  headers: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: this.authService.getToken()
  });

  saveImage(name: string, image: File) {
    const token = this.authService.getToken();
    const formData = new FormData();
    formData.append(name, image);
    const url_api = `http://localhost:3000/api/images/product-images/upload`;
    return (this.http.post(url_api, formData));
  }

  getImageByName(name: string) {
    const url_api = `http://localhost:3000/api/images/product-images/download/${name}`;
    return this.http1.get(url_api,{responseType: ResponseContentType.Blob})
  }

  getAllImages(products: ProductInterface[]){
    let images;
    return images = new Observable(
      (observer)=>{
        for (let product of products) {
          this.getImageByName(product.image).subscribe(data => {
            observer.next(data);
            // this.images.push(data);

            console.log(observer);
          })
        }
      }
    )
  }

  deleteImage(name: string) {
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/images/product-images/files/${name}`;
    return this.http.delete(url_api, { headers: this.headers }).pipe(map(data => data));
  }

}