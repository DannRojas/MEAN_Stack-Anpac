import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { ClientInterface } from './../models/client-interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-type": "application/json",
    Authorization: this.authService.getToken()
  })

  getAllClients(): Observable<ClientInterface[]>{
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/clients?access_token=${token}`;
    return this.http.get<ClientInterface[]>(url_api, {headers: this.headers});
  }

  getClientById(id: string): Observable<ClientInterface>{
    const url_api = `http://localhost:3000/api/clients/${id}`;
    return this.http.get<ClientInterface>(url_api);
  }

  createClient(client: ClientInterface): Observable<ClientInterface>{
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/clients?access_token=${token}`;
    return this.http.post<ClientInterface>(url_api, client, {headers: this.headers});
  }

  updateClient(client: ClientInterface): Observable<ClientInterface>{
    const token = this.authService.getToken();
    const clientId = client.id;
    const url_api = `http://localhost:3000/api/clients/${clientId}/?access_token=${token}`;
    return this.http.put<ClientInterface>(url_api, client, {headers: this.headers});
  }

  deleteClient(id: string){
    const token = this.authService.getToken();
    const url_api = `http://localhost:3000/api/clients/${id}/?access-token=${token}`;
    return this.http.delete<ClientInterface>(url_api, {headers: this.headers}).pipe(map(data =>data));
  }
}
