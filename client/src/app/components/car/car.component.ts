import { CarProductInterface } from './../../models/carProduct-interface';
import { ProductInterface } from './../../models/product-interface';
import { CarService } from './../../services/car.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {

  public carProducts: CarProductInterface[];

  constructor(private carService: CarService) { }

  ngOnInit() {

  }

}
