//Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';

//Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { LoginComponent } from './components/user/login/login.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CarComponent } from './components/car/car.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { Page404Component } from './components/page404/page404.component';
import { ProductComponent } from './components/product/product.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { InventoryComponent } from './components/administration/inventory/inventory.component';
import { ClientsComponent } from './components/administration/clients/clients.component';
import { FormProductComponent } from './components/administration/form-product/form-product.component';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';

//Pipes
import { FilterProductPipe } from './pipes/filter-product.pipe';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    LoginComponent,
    FavoritesComponent,
    CarComponent,
    ContactComponent,
    AboutComponent,
    Page404Component,
    ProductComponent,
    NavigationComponent,
    InventoryComponent,
    ClientsComponent,
    FilterProductPipe,
    FormProductComponent,
    ConfirmDeleteComponent,
    BestSellersComponent
  ],
  imports: [
    BrowserModule,
    CarouselModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: 'Your_api_key'
    })
  ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
