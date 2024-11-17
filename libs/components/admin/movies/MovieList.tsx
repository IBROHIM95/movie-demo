import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Movie } from '../../../types/movie/movie';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { MovieStatus } from '../../../enums/movie.enum';

interface Data {
	id: string;
	name: string;
	agent: string;
	country: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'name',
		numeric: true,
		disablePadding: false,
		label: 'NAME',
	},
	
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'country',
		numeric: false,
		disablePadding: false,
		label: 'COUNTRY',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface MoviePanelListType {
	movies: Movie[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateMovieHandler: any;
	removeMovieHandler: any;
}

export const MoviePanelList = (props: MoviePanelListType) => {
	const {
		movies,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateMovieHandler,
		removeMovieHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{movies.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{movies.length !== 0 &&
							movies.map((movie: Movie, index: number) => {
								const movieImage = `${REACT_APP_API_URL}/${movie?.movieImages[0]}`;

								return (
									<TableRow hover key={movie?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{movie._id}</TableCell>
										<TableCell align="left" className={'name'}>
										{movie.movieStatus === MovieStatus.ACTIVE ? (
										   <Stack direction={'row'}>
												<Link href={`/movie/detail?id=${movie?._id}`}>
													<div>
														<Avatar alt="Remy Sharp" src={movieImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
												</Link>
												<Link href={`/movie/detail?id=${movie?._id}`}>
													<div>{movie.movieName}</div>
												</Link>
											</Stack> ): (
												<Stack direction={'row'}>
												
													<div>
														<Avatar alt="Remy Sharp" src={movieImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{marginTop:'10px'}} >{movie.movieName}</div>
												
											   </Stack>
											)}
											
										</TableCell>
										<TableCell align="center">{movie.memberData?.memberNick}</TableCell>
										<TableCell align="center">{movie.movieCountry}</TableCell>
										<TableCell align="center">{movie.movieType}</TableCell>
										<TableCell align="center">
											{movie.movieStatus === MovieStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeMovieHandler(movie._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{movie.movieStatus === MovieStatus.PROCCESS && (
												<Button className={'badge warning'}>{movie.movieStatus}</Button>
											)}

											{movie.movieStatus === MovieStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{movie.movieStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(MovieStatus)
															.filter((ele) => ele !== movie.movieStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateMovieHandler({ _id: movie._id, movieStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
