import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopMovieCard from './TopMovieCard';
import { MoviesInquiry } from '../../types/movie/movie.input';
import { Movie } from '../../types/movie/movie';
import { useMutation, useQuery } from '@apollo/client';
import { GET_MOVIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_MOVIE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface TopMoviesProps {
	initialInput: MoviesInquiry;
}

const TopMovies = (props: TopMoviesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topMovies, setTopMovies] = useState<Movie[]>([]);

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
			setTopMovies(data?.getMovies?.list)
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
		  console.log('ERROR, likePropertyHandler:', err.message);
		  sweetMixinErrorAlert(err.message).then()
		  
		}
   }


	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top movies</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topMovies.map((movie: Movie) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={movie?._id}>
										<TopMovieCard movie={movie} likeMovieHandler={likeMovieHandler}/>
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
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top movies</span>
							<p>Check out our Top Movies</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
						>
							{topMovies.map((movie: Movie) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={movie?._id}>
										<TopMovieCard movie={movie} likeMovieHandler={likeMovieHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopMovies.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'movieRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopMovies;
