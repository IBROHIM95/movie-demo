import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Movie } from '../../types/movie/movie';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface MovieBigCardProps {
	movie: Movie;
	likeMovieHandler?: any
}

const MovieBigCard = (props: MovieBigCardProps) => {
	const { movie, likeMovieHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goMovieDetatilPage = (movieId: string) => {
		router.push(`/movie/detail?id=${movieId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goMovieDetatilPage(movie?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${movie?.movieImages?.[0]})` }}
				>
					{movie?.movieRank && movie?.movieRank >= 50 && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{movie?.movieName}</strong>
					
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{movie?.movieSeasons} season</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{movie?.movieDuration} duration</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{movie?.movieYear} - year</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{movie?.movieViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e:any) => {
									e.stopPropagation();
									likeMovieHandler(user, movie?._id)
								}}
							>
								{movie?.meLiked && movie?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{movie?.movieLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default MovieBigCard;
