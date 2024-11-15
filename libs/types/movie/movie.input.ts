import { MovieCountry, MovieStatus, MovieType } from '../../enums/movie.enum';
import { Direction } from '../../enums/common.enum';

export interface MovieInput {
	movieType: MovieType;
	movieCountry: MovieCountry;
	movieName: string;
	movieYear: number;
	movieSeasons: number;
	movieDuration: number;
	movieImages: string[];
	movieDesc?: string;
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	countryList?: MovieCountry[];
	typeList?: MovieType[];
	seasonsList?: Number[];
	duration?: Number[];
	periodsRange?: PeriodsRange;
	yearsRange?: Range;
	text?: string;
}

export interface MoviesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	movieStatus?: MovieStatus;
}

export interface AgentMoviesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	movieStatus?: MovieStatus;
	movieCountryList?: MovieCountry[];
}

export interface AllMoviesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}