import { ImageService } from './../../services/image.service';
import { ProductInterface } from './../../models/product-interface';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

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
      this.prod = prod;
      this.imageService.getAllImages(this.prod).pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
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
