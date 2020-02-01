import { isNullOrUndefined } from 'util';
import { AuthService } from './../../../services/auth.service';
import { UserInterface } from './../../../models/user-interface';
import { ProductService } from './../../../services/product.service';
import { ImageService } from './../../../services/image.service';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductInterface } from 'src/app/models/product-interface';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit {

  constructor(private imageService: ImageService, private productService: ProductService, private authService: AuthService) { }

  public product: ProductInterface = {};
  public isUpdate: boolean = false;

  //User state
  public user: UserInterface;
  public isSuperAdmin: boolean = false;

  @ViewChild('formProduct')
  modalProduct: {
    show: () => void,
    hide: () => void
  };

  @ViewChild('fileInput')
  fileInput: ElementRef;

  @Output()
  public reloadList: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('productForm')
  public productForm: NgForm;
  public errorForm: boolean = null;

  public image: File = null;

  public categories: any[] = [
    { value: "Grasas", label: "Grasas" },
    { value: "Lubricantes", label: "Lubricantes" },
    { value: "SistemaInspección", label: "Sistema Inspección" },
    { value: "Metales/Metalistería", label: "Metales/Metalistería" },
    { value: "Protectores", label: "Protectores" },
    { value: "Limpiadores", label: "Limpiadores" },
    { value: "Anti-Agripamiento/Deslizantes", label: "Anti-Agripamiento/Deslizantes" },
    { value: "AgentesDesmoldeadores", label: "Agentes Desmoldeadores" }
  ]


  ngOnInit() {
    this.product.imagePath = "../../../../assets/png/producto-sin-imagen.png";
  }

  openModal(product?: ProductInterface) {
    if (isNullOrUndefined(product.id)) {
      this.isUpdate = false;
      product.boxCapacity=1;
      product.boxes=0;
      product.singleUnits=0;
      product.units=0;
    }else{
      this.isUpdate = true;
    }
    this.product = Object.assign({}, product);
    this.modalProduct.show();
  }

  closeFormProduct() {
    this.image = null;
    this.fileInput.nativeElement.value = null;
    this.productForm.reset();
    this.modalProduct.hide();
    this.isUpdate = false;
    this.errorForm = null;
    this.product = {};
    this.product.imagePath = "../../../../assets/png/producto-sin-imagen.png";
  }
  
  onFileSelected(event): void {
    try{
      this.image = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.image);
      reader.onload = () => {
        this.product.imagePath = reader.result.toString();
      }
    }catch(e) {
      this.product.imagePath = "../../../../assets/png/producto-sin-imagen.png";
    }
  }

  getCurrentUser() {
    this.user = this.authService.getCurrentUser();
    if (this.user.type === "super admin") {
      this.isSuperAdmin = true;
    } else {
      this.isSuperAdmin = false;
    }
  }

  onPreUpdate(product: ProductInterface): void {
    this.isUpdate = true;
    this.product = Object.assign({}, product);
    this.modalProduct.show();
  }


  changesOnBCOrU(boxCapacity): void {
    this.product.singleUnits = this.product.units % this.product.boxCapacity;
    this.product.boxes = (this.product.units - this.product.singleUnits) / this.product.boxCapacity;
  }

  changesOnBOrSU(boxes): void {
    this.product.units = (this.product.boxes * this.product.boxCapacity) + this.product.singleUnits;
  }

  onAddOrUpdate() {
    if (this.isUpdate) {
      if (this.image != null) {
        this.imageService.deleteImage(this.product.image).subscribe(deleteImage => {
          this.product.image = this.image.name;
          this.imageService.saveImage(this.image).subscribe(saveImage => {
            this.productService.updateProduct(this.product).subscribe(updateProduct => {
              this.closeFormProduct();
              this.reloadList.emit("reload");
              this.errorForm = false;
            })
          })
        })
      } else {
        this.productService.updateProduct(this.product).subscribe(updateProduct => {
          this.closeFormProduct();
          this.reloadList.emit("reload");
          this.errorForm = false;
        })
      }
    } else {
      if (this.productForm.valid && this.product.imagePath != "../../../../assets/png/producto-sin-imagen.png" && !isNullOrUndefined(this.image)) {
        this.imageService.saveImage(this.image).subscribe(saveImage => {
          this.product.image = this.image.name;
          this.productService.saveProduct(this.product).subscribe(newProduct => {
            this.closeFormProduct();
            this.reloadList.emit("reload");
            this.errorForm = false;
          })
        })
      } else {
        this.errorForm = true;
      }
    }
  }

  validator(){
    if(isNullOrUndefined(this.product.code) || isNullOrUndefined(this.product.category) || isNullOrUndefined(this.product.name) || isNullOrUndefined(this.product.applications) || isNullOrUndefined(this.product.description) || isNullOrUndefined(this.product.size) || isNullOrUndefined(this.product.price) || isNullOrUndefined(this.product.boxCapacity) || isNullOrUndefined(this.product.units) || isNullOrUndefined(this.product.available) || isNullOrUndefined(this.product.bestSeller)){
      this.errorForm = true;
    }else{
      this.errorForm = false;
      this.onAddOrUpdate();
    }
  }

}
