import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { CarComponent } from './components/car/car.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { Page404Component } from './components/page404/page404.component';
import { InventoryComponent } from './components/administration/inventory/inventory.component';


const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'product/:id', component:ProductComponent},
    {path: 'favorites', component:FavoritesComponent}, //TODO: only users auth
    {path: 'car-shop', component:CarComponent}, //TODO: only users auth
    {path: 'contact', component:ContactComponent},
    {path: 'about', component:AboutComponent},
    {path: 'user/profile', component:ProfileComponent}, //TODO: only users auth
    // Admin rutes
    {path: 'admin/inventory', component:InventoryComponent},
    {path: '**', component:Page404Component}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }