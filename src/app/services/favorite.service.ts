import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Favorites} from '../components/event-detail/event-detail.component';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  // DON'T DELETE, PLAN FOR BACKEND
  getFavorites() {
    return this.http.get<Favorites>('../assets/favorites.json')
  }
  postFavorite(favoriteForm) {
    return this.http.post<Favorites>('../assets/favorites.json', favoriteForm);
  }
}
