export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;


const thisYear = new Date().getFullYear();

export const movieYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	movieYears.push(String(i));
}

export const movieYear = [2024, 2023, 2022, 2021, 2020, 2010-2019, 2000-2009, 1990-1999, 1980-1989];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topPropertyRank = 2;
