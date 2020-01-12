import { ImageService } from './../../services/image.service';
import { ProductInterface } from './../../models/product-interface';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  customOptions: OwlOptions = {
    loop: true,
    // slideBy: 2,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    navText: ["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"],
    // responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  constructor(private productService: ProductService, private imageService: ImageService) { }

  private unsubscribe$ = new Subject<void>();

  public products: ProductInterface[];
  public imagePort: string;
  private prod: ProductInterface[];

  ngOnInit() {
    this.getListProducts();
  }

  getListProducts(){
    this.productService.getAllProducts().subscribe(prod => {
      this.imageService.getAllImages(prod).pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
        this.products = products;
      })
    })
  }

  getImages() {
    this.imageService.getAllImages(this.products).subscribe(res => {
      console.log(res);
    })
  }

  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
