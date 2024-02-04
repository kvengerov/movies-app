import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonList,
  IonAvatar,
  IonItem,
  IonSkeletonText,
  IonAlert,
  IonLabel,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { catchError, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieResult } from '../interfaces/movie.interface';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-home-defer',
  templateUrl: './home-defer.page.html',
  styleUrls: ['./home-defer.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonAvatar,
    IonItem,
    IonSkeletonText,
    IonAlert,
    IonLabel,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    DatePipe,
    RouterModule,
  ],
})
export class HomeDeferPage {
  private moveService = inject(MovieService);
  private currentPage = 1;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public error: string | null = null;
  public imageBaseUrl = environment.imageBaseUrl;
  public dummyArray = new Array(5);

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.moveService.getPopularMovies(this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
        catchError((err: any) => {
          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (response) => {
          this.movies = [...this.movies, ...response.results];
          if (event) {
            event.target.disabled = response.total_pages === this.currentPage;
          }
        }
      });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
}
