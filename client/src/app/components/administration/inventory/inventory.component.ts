import { NgForm } from '@angular/forms';
import { ImageService } from './../../../services/image.service';
import { ProductInterface } from './../../../models/product-interface';
import { ProductService } from './../../../services/product.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IMyOptions } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {

  constructor(private productService: ProductService, private imageService: ImageService) { }

  private unsubscribe$ = new Subject<void>();

  @ViewChild('btnDelete')
  btnDelete: ElementRef;

  @ViewChild('btnFormProduct')
  btnFormProduct: ElementRef;

  @ViewChild('productForm')
  public productForm: NgForm;

  public products: ProductInterface[];
  public selectedProduct: ProductInterface = {};

  // public productForm: FormGroup;
  public isUpdate: boolean = false;

  public image: File;
  private sorted = false;

  public model: Date = new Date(2020,10,19);
  public fecha = this.model.getFullYear()+"-"+this.model.getMonth()+"-"+this.model.getDate();

  selectedDate = {date: {year: 2019, month: 5, day: 8}};

  // public selectedCategory = "Grasas";
  public categories: any[] = [
    { value: "Grasas", label: "Grasas" },
    { value: "Lubricantes", label: "Lubricantes" },
    { value: "Sistema Inspección", label: "Sistema Inspección" },
    { value: "Metales/Metalistería", label: "Metales/Metalistería" },
    { value: "Protectores", label: "Protectores" },
    { value: "Limpiadores", label: "Limpiadores" },
    { value: "Anti-Agripamiento/Deslizantes", label: "Anti-Agripamiento/Deslizantes" },
    { value: "Agentes Desmoldeadores", label: "Agentes Desmoldeadores" }
  ]

  ngOnInit() {
    this.getListProducts();
    this.selectedProduct.imagePath = "../../../../assets/png/producto-sin-imagen.png";
    console.log(this.model);
    console.log(typeof(this.model.getMonth()));
    console.log(this.fecha);
  }

  getListProducts() {
    this.productService.getAllProducts().subscribe(prod => {
      this.imageService.getAllImages(prod).pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
        this.products = products;
        for (let i in this.products) {
          this.products[i].singleUnits = this.products[i].units % this.products[i].boxCapacity;
          this.products[i].boxes = (this.products[i].units - this.products[i].singleUnits) / this.products[i].boxCapacity;
        }
      })
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  sortBy(by: string | any): void {
    this.products.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });
    this.sorted = !this.sorted;
  }

  onPreDelete(product: ProductInterface): void {
    this.selectedProduct = Object.assign({}, product);
    this.btnDelete.nativeElement.click();
  }

  onPreUpdate(product: ProductInterface): void {
    this.isUpdate = true;
    // this.productForm.reset();
    this.selectedProduct = Object.assign({}, product);
    this.btnFormProduct.nativeElement.click();
  }

  onAddOrUpdate() {
    console.log(this.selectedProduct);

  }

  changesOnBCOrU(boxCapacity): void {
    this.selectedProduct.singleUnits = this.selectedProduct.units % this.selectedProduct.boxCapacity;
    this.selectedProduct.boxes = (this.selectedProduct.units - this.selectedProduct.singleUnits) / this.selectedProduct.boxCapacity;
  }

  changesOnBOrSU(boxes): void {
    this.selectedProduct.units = (this.selectedProduct.boxes * this.selectedProduct.boxCapacity) + this.selectedProduct.singleUnits;
  }

  changesOnDate(event){
    console.log(event);
    console.log(typeof(event));
  }

  onFileSelected(event): void {
    this.image = event.target.files[0];
    // console.log(event.target);
    console.log('Fichero ' + this.image.name);
    const reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = () => {
      // console.log('ya');
      this.selectedProduct.imagePath = reader.result.toString();
    }
  }

  public myDatePickerOptions: IMyOptions = {
    // Strings and translations
    dayLabels: { su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab' },
    dayLabelsFull: {
      su: "Domingo", mo: "Lunes", tu: "Martes", we: "Miercoles", th: "Jueves", fr: "Viernes", sa:
        "Sabado"
    },
    monthLabels: {
      1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10:
        'Oct', 11: 'Nov', 12: 'Dic'
    },
    monthLabelsFull: {
      1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio", 7: "Julio", 8:
        "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
    },

    // Buttons
    todayBtnTxt: "Hoy",
    clearBtnTxt: "Limpiar",
    closeBtnTxt: "Cerrar",

    // Format
    dateFormat: 'dd.mm.yyyy',

    // First day of the week
    firstDayOfWeek: 'mo',

    // // Disable dates
    // disableUntil: { year: 2018, month: 10, day: 1 },
    // disableSince: { year: 2018, month: 10, day: 31 },
    // disableDays: [{ year: 2018, month: 10, day: 3 }],
    // disableDateRanges: [{ begin: { year: 2018, month: 10, day: 5 }, end: { year: 2018, month: 10, day: 7 } }],
    // disableWeekends: false,

    // Enable dates (when disabled)

    // Year limits
    minYear: 1000,
    maxYear: 9999,

    // Show Today button
    showTodayBtn: true,

    // Show Clear date button
    showClearDateBtn: true,

    markCurrentDay: true,
    // markDates: [{ dates: [{ year: 2020, month: 1, day: 20 }], color: '#303030' }],
    // markWeekends: undefined,
    disableHeaderButtons: false,
    showWeekNumbers: false,
    height: '100px',
    width: '100%',
    selectionTxtFontSize: '15px'

  };

}
