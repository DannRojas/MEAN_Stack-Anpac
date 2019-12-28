import { Injectable } from '@angular/core';
import { ProductInterface } from './../models/product-interface';
import { CarProductInterface } from '../models/carProduct-interface';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor() { }

  public carProducts: CarProductInterface[]

  addProductToCar(product: ProductInterface):void{
    this.carProducts.push(product);
  }

  addProductsToCar(products: any[]):void{
    this.carProducts = this.carProducts.concat(products);
  }

  deleteProductFromCar(product: ProductInterface):void{
    let indice = this.carProducts.findIndex(cp => cp.code === product.code);
    this.carProducts.slice(indice, 1);
  }
}
