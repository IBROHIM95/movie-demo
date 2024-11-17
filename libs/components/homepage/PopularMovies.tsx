import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularMovieCard from './PopularMovieCard';
import { Movie } from '../../types/movie/movie';
import Link from 'next/link';
import { MoviesInquiry } from '../../types/movie/movie.input';
import { useQuery } from '@apollo/client';
import { GET_MOVIES } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface PopularMoviesProps {
	initialInput: MoviesInquiry;
}

const PopularMovies = (props: PopularMoviesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

	/** APOLLO REQUESTS **/


	const {
		loading: getMoviesLoading,
		data: getMoviesData,
		error: getMoviesError,
		refetch: getMoviesRefetch,  
	} = useQuery(GET_MOVIES, {
		fetchPolicy: 'cache-and-network',
		variables: {input: initialInput},
		notifyOnNetworkStatusChange: true,
		onCompleted:(data: T) =>  {
			setPopularMovies(data?.getMovies?.list)
		}
	})

	/** HANDLERS **/

	if (!popularMovies) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular movies</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularMovies.map((movie: Movie) => {
								return (
									<SwiperSlide key={movie._id} className={'popular-property-slide'}>
										<PopularMovieCard movie={movie} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular movies</span>
							<p>Movies is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/property'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularMovies.map((movie: Movie) => {
								return (
									<SwiperSlide key={movie._id} className={'popular-property-slide'}>
										<PopularMovieCard movie={movie} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularMovies.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'movieViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularMovies;
