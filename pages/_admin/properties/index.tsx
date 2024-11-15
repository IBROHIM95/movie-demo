import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { PropertyPanelList } from '../../../libs/components/admin/properties/PropertyList';
import { AllMoviesInquiry } from '../../../libs/types/movie/movie.input';
import { Movie } from '../../../libs/types/movie/movie';
import { MovieCountry, MovieStatus } from '../../../libs/enums/movie.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { MovieUpdate } from '../../../libs/types/movie/movie.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_MOVIE_BY_ADMIN, UPDATE_MOVIE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_MOVIES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
const AdminMovies: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [moviesInquiry, setMoviesInquiry] = useState<AllMoviesInquiry>(initialInquiry);
	const [movies, setMovies] = useState<Movie[]>([]);
	const [moviesTotal, setMoviesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		moviesInquiry?.search?.movieStatus ? moviesInquiry?.search?.movieStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateMovieByAdmin] = useMutation(UPDATE_MOVIE_BY_ADMIN)
	const [removeMovieByAdmin] = useMutation(REMOVE_MOVIE_BY_ADMIN)

	const {
		loading: getAllMoviesByAdminLoading,
		data: getAllMoviesByAdminData,
		error: getAllMoviesByAdminError,
		refetch: getAllMoviesByAdminRefetch,  
	} = useQuery(GET_ALL_MOVIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {input: moviesInquiry},
		notifyOnNetworkStatusChange: true,
		onCompleted:(data: T) =>  {
			setMovies(data?.getAllMoviesByAdmin?.list)
			setMoviesTotal(data?.getAllMoviesByAdmin?.metaCounter[0]?.total ?? 0)
		}
	})

	/** LIFECYCLES **/
	useEffect(() => {
		getAllMoviesByAdminRefetch({input: moviesInquiry}).then()
	}, [moviesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		moviesInquiry.page = newPage + 1;
		await getAllMoviesByAdminRefetch({input: moviesInquiry})
		setMoviesInquiry({ ...moviesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		moviesInquiry.limit = parseInt(event.target.value, 10);
		moviesInquiry.page = 1;
		await getAllMoviesByAdminRefetch({input: moviesInquiry})
		setMoviesInquiry({ ...moviesInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setMoviesInquiry({ ...moviesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setMoviesInquiry({ ...moviesInquiry, search: { movieStatus: MovieStatus.ACTIVE } });
				break;
			case 'PROCCESS':
				setMoviesInquiry({ ...moviesInquiry, search: { movieStatus: MovieStatus.PROCCESS } });
				break;
			case 'DELETE':
				setMoviesInquiry({ ...moviesInquiry, search: { movieStatus: MovieStatus.DELETE } });
				break;
			default:
				delete moviesInquiry?.search?.movieStatus;
				setMoviesInquiry({ ...moviesInquiry });
				break;
		}
	};

	const removeMovieHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeMovieByAdmin({
					variables: {
						input: id
					}
				})
				 await getAllMoviesByAdminRefetch({input: moviesInquiry})
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setMoviesInquiry({
					...moviesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...moviesInquiry.search,
						movieCountryList: [newValue as MovieCountry],
					},
				});
			} else {
				delete moviesInquiry?.search?.movieCountryList;
				setMoviesInquiry({ ...moviesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateMovieHandler = async (updateData: MovieUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateMovieByAdmin({
				variables: {
					input: updateData
				}
			})
			menuIconCloseHandler();
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Movie List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'SOLD')}
									value="SOLD"
									className={value === 'SOLD' ? 'li on' : 'li'}
								>
									Sold
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(MovieCountry).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<PropertyPanelList
							movies={movies}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateMovieHandler={updateMovieHandler}
							removeMovieHandler={removeMovieHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={moviesTotal}
							rowsPerPage={moviesInquiry?.limit}
							page={moviesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminMovies.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminMovies);
