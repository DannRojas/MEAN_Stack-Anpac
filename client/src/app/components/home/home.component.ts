import { isNullOrUndefined } from 'util';
import { UserInterface } from './../../models/user-interface';
import { AuthService } from './../../services/auth.service';
import { CarService } from './../../services/car.service';
import { ImageService } from './../../services/image.service';
import { ProductInterface } from './../../models/product-interface';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CarProductInterface } from 'src/app/models/carProduct-interface';
declare var jarallax: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  ngAfterViewInit() {
    jarallax(document.querySelectorAll('.jarallax'), {
      speed: 0.2
    });
  }

  @Output() quantity = new EventEmitter<string>();

  @ViewChild('grasas')
  public grasas: {
    toggle: () => void;
  }
  @ViewChild('lubricantes')
  public lubricantes: {
    toggle: () => void;
  }
  @ViewChild('sistInspeccion')
  public sistInspeccion: {
    toggle: () => void;
  }
  @ViewChild('metales')
  public metales: {
    toggle: () => void;
  }
  @ViewChild('protectores')
  public protectores: {
    toggle: () => void;
  }
  @ViewChild('limpiadores')
  public limpiadores: {
    toggle: () => void;
  }
  @ViewChild('antiDeslizantes')
  public antiDeslizantes: {
    toggle: () => void;
  }
  @ViewChild('desmoldeadores')
  public desmoldeadores: {
    toggle: () => void;
  }

  public categories: any[] = [{ name: "Grasas", value: false, quantity: 0 },
  { name: "Lubricantes", value: true, quantity: 0 },
  { name: "SistemaInspección", value: true, quantity: 0 },
  { name: "Metales/Metalistería", value: true, quantity: 0 },
  { name: "Protectores", value: true, quantity: 0 },
  { name: "Limpiadores", value: true, quantity: 0 },
  { name: "Anti-Agripamiento/Deslizantes", value: true, quantity: 0 },
  { name: "AgentesDesmoldeadores", value: true, quantity: 0 }]


  constructor(private productService: ProductService, private imageService: ImageService, private router: Router, private carProductService: CarService, private authService: AuthService) { }

  private unsubscribe$ = new Subject<void>();
  public products: ProductInterface[];
  public productCategory: ProductInterface[];

  private user: UserInterface;
  public carProducts: CarProductInterface[];

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.getListProducts();
    this.productService.getCountProducts("Grasas").subscribe(quantity => this.categories[0].quantity = quantity.count);
    this.productService.getCountProducts("Lubricantes").subscribe(quantity => this.categories[1].quantity = quantity.count);
    this.productService.getCountProducts("SistemaInspección").subscribe(quantity => this.categories[2].quantity = quantity.count);
    this.productService.getCountProducts("Metales/Metalistería").subscribe(quantity => this.categories[3].quantity = quantity.count);
    this.productService.getCountProducts("Protectores").subscribe(quantity => this.categories[4].quantity = quantity.count);
    this.productService.getCountProducts("Limpiadores").subscribe(quantity => this.categories[5].quantity = quantity.count);
    this.productService.getCountProducts("Anti-Agripamiento/Deslizantes").subscribe(quantity => this.categories[6].quantity = quantity.count);
    this.productService.getCountProducts("AgentesDesmoldeadores").subscribe(quantity => this.categories[7].quantity = quantity.count);
  }

  getListProducts() {
    this.productService.getAllProducts().subscribe(prod => {
      this.imageService.getAllImages(prod).pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
        this.products = products;
        this.buildProducts("Grasas");
        if (!isNullOrUndefined(this.user) && this.user.type === "client") {
          this.carProductService.getCarProductsByClient(this.user.id).subscribe(carProducts => {
            this.carProducts = carProducts;
            this.products.map(product => {
              product.carProduct = false;
              for (let i in this.carProducts) {
                if (this.carProducts[i].productId === product.id)
                  product.carProduct = true;
              }
            })
          })
        } else
          console.log("Nó es cliente");
        // console.log(this.products);
      })
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateDetailsProduct(idProduct: string) {
    this.router.navigate(["/product", idProduct]);
  }

  onToggle(catToggle: string) {
    this.buildProducts(catToggle);
    for (let i in this.categories) {
      if (!this.categories[i].value && this.categories[i].name != catToggle) {
        this.swToggle(this.categories[i].name);
        this.categories[i].value = true;
      } else if (this.categories[i].value && this.categories[i].name == catToggle) {
        this.swToggle(this.categories[i].name);
        this.categories[i].value = false;
      }
    }
  }

  swToggle(name: string) {
    switch (name) {
      case 'Grasas':
        this.grasas.toggle();
        break;
      case 'Lubricantes':
        this.lubricantes.toggle();
        break;
      case 'SistemaInspección':
        this.sistInspeccion.toggle();
        break;
      case 'Metales/Metalistería':
        this.metales.toggle();
        break;
      case 'Protectores':
        this.protectores.toggle();
        break;
      case 'Limpiadores':
        this.limpiadores.toggle();
        break;
      case 'Anti-Agripamiento/Deslizantes':
        this.antiDeslizantes.toggle();
        break;
      case 'AgentesDesmoldeadores':
        this.desmoldeadores.toggle();
        break;
    }
  }

  buildProducts(category: string) {
    this.productCategory = [];
    this.productCategory = this.products.filter((product) => {
      return (product.category === category);
    })
  }

  onAddToCar(idProduct: string) {
    let carProductExist: boolean = false;
    this.carProducts.map(carProduct => {
      if (carProduct.productId === idProduct) {
        // console.log("update carProduct");
        carProduct.quantity++;
        carProductExist = true;
        this.carProductService.updateCarProduct(carProduct).subscribe(data => this.getListProducts());
      }
    })
    if (!carProductExist) {
      // console.log("add new");
      let carProduct: CarProductInterface = {};
      carProduct.clientId = this.user.id;
      carProduct.productId = idProduct;
      carProduct.quantity = 1;
      this.carProductService.saveCarProduct(carProduct).subscribe(data => this.getListProducts());
    }
  }

}
