import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, MovieResult } from '../interfaces/movie.interface';

const BASE_URL = environment.apiUrl;
const API_KEY = environment.apiKeys;
@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);
  constructor() {}

  private createUrl(path: string, params: Record<string, any> = {}): string {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('language', 'en-US');

    Object.keys(params).forEach((key) => {
      url.searchParams.set(key, String(params[key]));
    });

    return url.toString();
  }

  getTopRatedMovies(): Observable<ApiResponse> {
    const url = this.createUrl('/movie/top_rated');
    return this.http.get<ApiResponse>(url);
  }

  getPopularMovies(page: number = 1): Observable<ApiResponse> {
    const url = this.createUrl('/movie/popular', { page });
    return this.http.get<ApiResponse>(url).pipe(delay(3000));
  }

  getMovieDetails(id: string): Observable<MovieResult> {
    const url = this.createUrl(`/movie/${id}`);
    return this.http.get<MovieResult>(url);
  }
}
