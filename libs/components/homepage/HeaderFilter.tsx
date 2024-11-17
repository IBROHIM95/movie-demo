import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { movieYear, movieYears } from '../../config';
import { MovieCountry, MovieType } from '../../enums/movie.enum';
import { MoviesInquiry } from '../../types/movie/movie.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput: MoviesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<MoviesInquiry>(initialInput);
	const countryRef: any = useRef();
	const typeRef: any = useRef();
	const durationRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openCountry, setOpenCountry] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openDuration, setOpenDuration] = useState(false);
	const [movieCountry, setMovieCountry] = useState<MovieCountry[]>(Object.values(MovieCountry));
	const [movieType, setMovieType] = useState<MovieType[]>(Object.values(MovieType));
	const [yearCheck, setYearCheck] = useState({ start: 1970, end: thisYear });
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!countryRef?.current?.contains(event.target)) {
				setOpenCountry(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!durationRef?.current?.contains(event.target)) {
				setOpenDuration(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenCountry(false);
		setOpenDuration(false);
		setOpenType(false);
		setOpenAdvancedFilter(status);
	};

	const countryStateChangeHandler = () => {
		setOpenCountry((prev) => !prev);
		setOpenDuration(false);
		setOpenType(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenCountry(false);
		setOpenDuration(false);
	};

	const durationStateChangeHandler = () => {
		setOpenDuration((prev) => !prev);
		setOpenType(false);
		setOpenCountry(false);
	};

	const disableAllStateHandler = () => {
		setOpenDuration(false);
		setOpenType(false);
		setOpenCountry(false);
	};

	const movieCountrySelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						countryList: [value],
					},
				});
				typeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const movieTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				durationStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, movieTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	// const movieRoomSelectHandler = useCallback(
	// 	async (value: any) => {
	// 		try {
	// 			setSearchFilter({
	// 				...searchFilter,
	// 				search: {
	// 					...searchFilter.search,
	// 					roomsList: [value],
	// 				},
	// 			});
	// 			disableAllStateHandler();
	// 		} catch (err: any) {
	// 			console.log('ERROR, propertyRoomSelectHandler:', err);
	// 		}
	// 	},
	// 	[searchFilter],
	// );

	// const propertyBedSelectHandler = useCallback(
	// 	async (number: Number) => {
	// 		try {
	// 			if (number != 0) {
	// 				if (searchFilter?.search?.bedsList?.includes(number)) {
	// 					setSearchFilter({
	// 						...searchFilter,
	// 						search: {
	// 							...searchFilter.search,
	// 							bedsList: searchFilter?.search?.bedsList?.filter((item: Number) => item !== number),
	// 						},
	// 					});
	// 				} else {
	// 					setSearchFilter({
	// 						...searchFilter,
	// 						search: { ...searchFilter.search, bedsList: [...(searchFilter?.search?.bedsList || []), number] },
	// 					});
	// 				}
	// 			} else {
	// 				delete searchFilter?.search.bedsList;
	// 				setSearchFilter({ ...searchFilter });
	// 			}

	// 			console.log('propertyBedSelectHandler:', number);
	// 		} catch (err: any) {
	// 			console.log('ERROR, propertyBedSelectHandler:', err);
	// 		}
	// 	},
	// 	[searchFilter],
	// );

	// const propertyOptionSelectHandler = useCallback(
	// 	async (e: any) => {
	// 		try {
	// 			const value = e.target.value;
	// 			setOptionCheck(value);

	// 			if (value !== 'all') {
	// 				setSearchFilter({
	// 					...searchFilter,
	// 					search: {
	// 						...searchFilter.search,
	// 						options: [value],
	// 					},
	// 				});
	// 			} else {
	// 				delete searchFilter.search.options;
	// 				setSearchFilter({
	// 					...searchFilter,
	// 					search: {
	// 						...searchFilter.search,
	// 					},
	// 				});
	// 			}
	// 		} catch (err: any) {
	// 			console.log('ERROR, propertyOptionSelectHandler:', err);
	// 		}
	// 	},
	// 	[searchFilter],
	// );

	const movieYearHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						yearsRange: { ...searchFilter.search.yearsRange, start: parseInt(value) },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						yearsRange: { ...searchFilter.search.yearsRange, end: parseInt(value) },
					},
				});
			}
		},
		[searchFilter],
	);

	const yearStartChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, start: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				periodsRange: { start: Number(event.target.value), end: yearCheck.end },
			},
		});
	};

	const yearEndChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, end: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				periodsRange: { start: yearCheck.start, end: Number(event.target.value) },
			},
		});
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 1970, end: thisYear });
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.countryList?.length == 0) {
				delete searchFilter.search.countryList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			

			await router.push(
				`/movie?input=${JSON.stringify(searchFilter)}`,
				`/movie?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openCountry ? 'on' : ''}`} onClick={countryStateChangeHandler}>
							<span>{searchFilter?.search?.countryList ? searchFilter?.search?.countryList[0] : t('Country')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Property type')} </span>
							<ExpandMoreIcon />
						</Box>
						
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openCountry ? 'on' : ''}`} ref={countryRef}>
						{movieCountry.map((movie: string) => {
							return (
								<div onClick={() => movieCountrySelectHandler(movie)} key={movie}>
									<img src={`img/banner/cities/${movie}.webp`} alt="" />
									<span>{movie}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
						{movieType.map((type: string) => {
							return (
								<div
									style={{ backgroundImage: `url(/img/banner/types/${type.toLowerCase()}.webp)` }}
									onClick={() => movieTypeSelectHandler(type)}
									key={type}
								>
									<span>{type}</span>
								</div>
							);
						})}
					</div>

				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your home</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									
									
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Year Built</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{movieYears?.slice(0)?.map((year: number) => (
														<MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{movieYears
														?.slice(0)
														.reverse()
														.map((year: number) => (
															<MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
																{year}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
									<div className={'box'}>
										<span>movie year</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.yearsRange?.start}
													onChange={(e: any) => movieYearHandler(e, 'start')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{movieYear.map((square: number) => (
														<MenuItem
															value={square}
															disabled={(searchFilter?.search?.yearsRange?.end || 0) < square}
															key={square}
														>
															{square}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.yearsRange?.end}
													onChange={(e: any) => movieYearHandler(e, 'end')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{movieYear.map((square: number) => (
														<MenuItem
															value={square}
															disabled={(searchFilter?.search?.yearsRange?.start || 0) > square}
															key={square}
														>
															{square}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			yearsRange: {
				start: 1980,
				end: 2024,
			}
			
		},
	},
};

export default HeaderFilter;
