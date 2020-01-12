import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FavoriteInterface } from './../models/favorite-interface';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public selectedFavorite: FavoriteInterface = {};

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authService.getToken()
  })

  getAllFavorites(): Observable<FavoriteInterface[]>{
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/favorites?access_token=${token}`;
    return this.http.get<FavoriteInterface[]>(url_api, { headers: this.headers });
  }

  getFavoritesOfClient(): Observable<FavoriteInterface[]>{
    const token = this.authService.getToken();
    const id = this.authService.getCurrentUser().id;
    const url_api = `http://localhost:3000/api/favorites?filter[where][clientId]=${id}&access_token=${token}`;
    return this.http.get<FavoriteInterface[]>(url_api, { headers: this.headers });
  }

  saveFavorite(favorite: FavoriteInterface): Observable<FavoriteInterface>{
    const token = this.authService.getToken();
    const url_api = `http:// localhost:3000/api/favorites?access_token=${token}`;
    return this.http.post<FavoriteInterface>(url_api, favorite, {headers: this.headers});
  }

  deleteFavorite(id: string){
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/favorites/${id}/?access_token=${token}`;
    return this.http.delete<FavoriteInterface>(url_api, {headers: this.headers}).pipe(map(data => data));
  }
}
