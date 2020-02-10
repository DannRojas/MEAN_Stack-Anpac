import { isNullOrUndefined } from 'util';
import { takeUntil } from 'rxjs/operators';
import { ImageService } from './../../services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProductInterface } from 'src/app/models/product-interface';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  constructor(private productService: ProductService, private imageService: ImageService, private _activatedRoute: ActivatedRoute) {}

  private unsubscribe$ = new Subject<void>();
  public product: ProductInterface;
  public products: ProductInterface[];
  public relatedProducts: ProductInterface[];

  // @ViewChild('init')
  // init: ElementRef;

  ngOnInit() {
    this._activatedRoute.params.subscribe(route => {
      const idProduct = this._activatedRoute.snapshot.params['id'];
      this.getProduct(idProduct);
      // this.init.nativeElement.click();
    })
  }

  getProduct(idProduct: string) {
    this.productService.getProductById(idProduct).subscribe(product => {
      this.getRelatedProducts(product);
      this.imageService.getImageByName(product.image).subscribe(image => {
        this.product = product;
        const blob = new Blob([image.blob()], { type: 'image/jpg' })
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.product.imagePath = reader.result.toString();
        }, false)
        if (blob)
          reader.readAsDataURL(blob);
      })
    })
  }

  getRelatedProducts(product: ProductInterface) {
    this.productService.getAllProductsByAttribute("category", product.category).subscribe(prods => {
      this.imageService.getAllImages(prods).pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
        this.products = products.filter((prod) => {
          return (prod.id !== product.id);
        })
      })
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
