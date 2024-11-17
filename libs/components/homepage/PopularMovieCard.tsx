import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Movie } from '../../types/movie/movie';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topMovieRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularMovieCardProps {
	movie: Movie;
}

const PopularMovieCard = (props: PopularMovieCardProps) => {
	const { movie } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	const pushDetailHandler = async (movieIid: string) => {
		console.log('ID', movieIid);
		await router.push({pathname: '/movie/detail', query: {id: movieIid}})
		
	 }

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
				    onClick={() => pushDetailHandler(movie._id)}
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${movie?.movieImages[0]})` }}
				>
					{movie?.movieRank && movie?.movieRank >= topMovieRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(movie._id)} >{movie.movieName}</strong>
					
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{movie?.movieSeasons} season</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{movie?.movieDuration} hour</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{movie?.movieYear} year</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{movie?.movieViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
				    onClick={() => pushDetailHandler(movie._id)}
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${movie?.movieImages[0]})` }}
				>
					{movie?.movieRank && movie?.movieRank >= topMovieRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(movie._id)} >{movie.movieName}</strong>
					
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{movie?.movieSeasons} season</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{movie?.movieDuration} hour</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{movie?.movieYear} - year</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{movie?.movieViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularMovieCard;
