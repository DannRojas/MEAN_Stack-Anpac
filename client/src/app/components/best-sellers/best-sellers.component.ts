import { ProductInterface } from 'src/app/models/product-interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { ImageService } from 'src/app/services/image.service';
import { takeUntil } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss']
})
export class BestSellersComponent implements OnInit, OnDestroy {

  constructor(private productService: ProductService, private imageService: ImageService, private router: Router) { }

  private unsubscribe$ = new Subject<void>();
  public products: ProductInterface[];
  public visible: boolean;
  
  ngOnInit() {
    this.getBestSellersProducts();
    this.isVisible();
  }
  
  isVisible(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // console.log(event.url);
          if (event.url === "/" || event.url.match('/product/')) {
              this.visible = true;
              // console.log("Vendadero");
          } else {
              this.visible = false;
              // console.log("Falso");
          }
      }
  });
  }
  
  getBestSellersProducts(){
    this.productService.getAllProductsByAttribute("bestSeller", true).subscribe( prods => {
      this.imageService.getAllImages(prods).pipe(takeUntil(this.unsubscribe$)).subscribe( products => {
        this.products = products;
      })
    })
  }
  
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
    navText: ["<div class='nav-btn prev-slide'><-</div>", "<div class='nav-btn next-slide'>-></div>"],
    // responsiveClass: true,
    responsive: {
      0: {
        items: 2
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
