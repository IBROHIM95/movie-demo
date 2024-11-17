import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Movie } from '../../types/movie/movie';
import { MoviesInquiry } from '../../types/movie/movie.input';
import TrendMovieCard from './TrendMovieCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_MOVIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_MOVIE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendMoviesProps {
	initialInput: MoviesInquiry;
}

const TrendMovies = (props: TrendMoviesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendMovies, setTrendMovies] = useState<Movie[]>([]);

	/** APOLLO REQUESTS **/

	const [likeTargetMovie] = useMutation(LIKE_TARGET_MOVIE)
	

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
			setTrendMovies(data?.getMovies?.list)
		}
	})

	/** HANDLERS **/
	const likeMovieHandler = async (user: T, id:string) => {
		 try{
            if(!id) return;
			if(!user._id) throw new Error(Message.NOT_AUTHENTICATED)

			await likeTargetMovie({
				variables: {input: id},
			});
			await getMoviesRefetch({input: initialInput})

			await sweetTopSmallSuccessAlert('success', 800)

		 } catch(err:any) {
           console.log('ERROR, likeMovieHandler:', err.message);
		   sweetMixinErrorAlert(err.message).then()
		   
		 }
	}

	if (trendMovies) console.log('trendMovies:', trendMovies);
	if (!trendMovies) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Properties</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendMovies.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendMovies.map((movie: Movie) => {
									return (
										<SwiperSlide key={movie._id} className={'trend-property-slide'}>
											<TrendMovieCard movie={movie} likeMovieHandler={likeMovieHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trend Properties</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendMovies.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendMovies.map((movie: Movie) => {
									return (
										<SwiperSlide key={movie._id} className={'trend-property-slide'}>
											<TrendMovieCard movie={movie} likeMovieHandler={likeMovieHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendMovies.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'movieLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendMovies;
