import { ImageService } from './../../services/image.service';
import { ProductService } from './../../services/product.service';
import { ProductInterface } from './../../models/product-interface';
import { FavoriteInterface } from './../../models/favorite-interface';
import { FavoriteService } from './../../services/favorite.service';
import { AuthService } from './../../services/auth.service';
import { ClientService } from './../../services/client.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  constructor(private favoriteService: FavoriteService, private imageService: ImageService) { }

  private unsubscribe$ = new Subject<void>();

  // public favorites: FavoriteInterface[];
  public products: ProductInterface[];
  private prod: ProductInterface[];

  ngOnInit() {
    this.getListFavorites();
  }

  getListFavorites() {
    this.favoriteService.getFavoritesOfClient().subscribe(favorites => {
      this.prod = favorites;
      if(this.prod.length > 0){
        this.imageService.getAllImages(this.prod).pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
          this.products = products;
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
