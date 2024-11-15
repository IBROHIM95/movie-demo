import {  MovieCountry, MovieStatus, MovieType  } from '../../enums/movie.enum';

export interface MovieUpdate {
	_id: string;
	movieType?: MovieType;
	movieStatus?: MovieStatus;
	movieCountry?: MovieCountry;
	movieName?: string;
	movieYear?: number;
	movieSeasons?: number;
	movieDuration?: number;
	movieImages?: string[];
	movieDesc?: string;
	deletedAt?: Date;
	constructedAt?: Date;
}
