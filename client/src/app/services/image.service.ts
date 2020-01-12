import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ProductInterface } from './../models/product-interface';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Http, ResponseContentType } from '@angular/http';
import { of } from 'rxjs';

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

  getAllImages(products: ProductInterface[]): Observable<ProductInterface[]>{
    for(let i in products){
      this.getImageByName(products[i].image).subscribe(image => {
        const blob = new Blob([image.blob()], {type: 'image/jpg'})
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          products[i].imagePath = reader.result.toString();
        }, false)
        if(blob)
        reader.readAsDataURL(blob);
      })
    }
    return of<ProductInterface[]>(products);
  }

  deleteImage(name: string) {
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/images/product-images/files/${name}?access-token=${token}`;
    return this.http.delete(url_api, { headers: this.headers }).pipe(map(data => data));
  }

}