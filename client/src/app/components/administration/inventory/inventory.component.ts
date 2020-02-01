import { ConfirmDeleteComponent } from './../../confirm-delete/confirm-delete.component';
import { ImageService } from './../../../services/image.service';
import { ProductInterface } from './../../../models/product-interface';
import { ProductService } from './../../../services/product.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { FormProductComponent } from '../form-product/form-product.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {

  constructor(private productService: ProductService, private imageService: ImageService, private authService: AuthService) { }

  private unsubscribe$ = new Subject<void>();

  @ViewChild(FormProductComponent)
  formProductComponent: FormProductComponent;

  @ViewChild(ConfirmDeleteComponent)
  confirmDelete: ConfirmDeleteComponent;

  public products: ProductInterface[];
  public productsAux: ProductInterface[];
  public selectedProduct: ProductInterface = {};

  // Filters
  public filCat = "All";
  public filBestS = "All";
  public filAvai = "All";

  //Search
  public searchProd = "";

  public filterCat: any[] = [
    { value: "All", label: "Todos" },
    { value: "Grasas", label: "Grasas" },
    { value: "Lubricantes", label: "Lubricantes" },
    { value: "Sistema Inspección", label: "Sistema Inspección" },
    { value: "Metales/Metalistería", label: "Metales/Metalistería" },
    { value: "Protectores", label: "Protectores" },
    { value: "Limpiadores", label: "Limpiadores" },
    { value: "Anti-Agripamiento/Deslizantes", label: "Anti-Agripamiento/Deslizantes" },
    { value: "Agentes Desmoldeadores", label: "Agentes Desmoldeadores" }
  ]

  public filterBestS: any[] = [
    { value: "All", label: "Todos" },
    { value: true, label: "Más Vendidos" },
    { value: false, label: "Comunes" },
  ]

  public filterAvai: any[] = [
    { value: "All", label: "Todos" },
    { value: true, label: "Disponibles" },
    { value: false, label: "No Disponibles" },
  ]

  filterForCat(filter) {
    this.products = this.productsAux;
    this.filBestS = "All";
    this.filAvai = "All";
    this.searchProd = "";
    if (this.filCat != "All") {
      this.products = this.products.filter((product) => {
        return (product.category === filter);
      })
    }
  }

  filterForBestS(filter) {
    this.products = this.productsAux;
    this.filCat = "All";
    this.filAvai = "All";
    this.searchProd = "";
    if (this.filBestS != "All") {
      this.products = this.products.filter((product) => {
        return (product.bestSeller === filter);
      })
    }
  }

  filterForAvai(filter) {
    this.products = this.productsAux;
    this.filCat = "All";
    this.filBestS = "All";
    this.searchProd = "";
    if (this.filAvai != "All") {
      this.products = this.products.filter((product) => {
        return (product.available === filter);
      })
    }
  }

  ngOnInit() {
    this.getListProducts();
    // this.getCurrentUser();
    this.selectedProduct.imagePath = "../../../../assets/png/producto-sin-imagen.png";
  }

  getListProducts(event?: string) {
    this.productService.getAllProducts().subscribe(prod => {
      this.imageService.getAllImages(prod).pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
        this.products = products;
        for (let i in this.products) {
          this.products[i].singleUnits = this.products[i].units % this.products[i].boxCapacity;
          this.products[i].boxes = (this.products[i].units - this.products[i].singleUnits) / this.products[i].boxCapacity;
        }
        this.productsAux = this.products;
      })
    })
  }

  onPreDelete(product: ProductInterface): void {
    this.selectedProduct = Object.assign({}, product);
    this.confirmDelete.onPreConfirmDelete("¿Está seguro de que desea eliminar el producto: ", this.selectedProduct.name)
  }

  onConfirmDelete(confirmDelete: boolean) {
    if (confirmDelete) {
      this.imageService.deleteImage(this.selectedProduct.image).subscribe(deleteImage => {
        this.productService.deleteProduct(this.selectedProduct.id).subscribe(deleteProduct => {
          this.selectedProduct = {};
          this.selectedProduct.imagePath = "../../../../assets/png/producto-sin-imagen.png";
          this.getListProducts();
        })
      });
    } else {
      this.selectedProduct = {};
      this.selectedProduct.imagePath = "../../../../assets/png/producto-sin-imagen.png";
    }
  }

  updateModal(product: ProductInterface) {
    this.formProductComponent.openModal(product);
  }

  addModal() {
    this.selectedProduct = {}
    this.selectedProduct.imagePath = "../../../../assets/png/producto-sin-imagen.png";
    this.formProductComponent.openModal(this.selectedProduct);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
