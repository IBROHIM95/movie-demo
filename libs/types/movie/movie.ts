import { MovieCountry, MovieStatus, MovieType } from '../../enums/movie.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Movie {
	_id: string;
	movieType: MovieType;
	movieStatus: MovieStatus;
	movieCountry: MovieCountry;
	movieName: string;
	movieYear: number;
	movieSeasons: number;
	movieDuration: number;
	movieViews: number;
	movieLikes: number;
	movieComments: number;
	movieRank: number;
	movieImages: string[];
	movieDesc?: string;
	memberId: string;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Movies {
	list: Movie[];
	metaCounter: TotalCounter[];
}
