import { ImageService } from './../../services/image.service';
import { ProductInterface } from './../../models/product-interface';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private productService: ProductService, private imageService: ImageService) { }

  public products: ProductInterface[];
  public imagePort: string;
  private prod: any[];
  private nameImages: any[];

  ngOnInit() {
    this.getListProducts();
  }

  getListProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      for (let i in products) {
        this.imageService.getImageByName(this.products[i].image).subscribe(image => {
          const blob = new Blob([image.blob()], { type: 'image/jpg' });
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.products[i].imagePath = reader.result.toString();
          }, false)
          if (blob)
            reader.readAsDataURL(blob);
        })
      }
    },
      err => console.log(err))
  };

  getImages() {
    this.imageService.getAllImages(this.products).subscribe(res => {
      console.log(res);
    })
  }
}
