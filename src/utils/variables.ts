import { Timestamp } from 'firebase/firestore';


const TSDate = (date?: Date | string | Timestamp | number | null): Date => {
	const d = typeof date === "string" || typeof date === "number" ?
		new Date(date) :
		date && (date instanceof Timestamp || ("nanoseconds" in date && "seconds" in date)) ?
			new Date(new Timestamp(Number(date.seconds), Number(date.nanoseconds)).toDate()) :
			date && (typeof date === "object" && ("_nanoseconds" in date && "_seconds" in date)) ?
				new Date(new Timestamp(Number(date._seconds), Number(date._nanoseconds)).toDate()) :
				new Date(date instanceof Date && !isNaN(date as unknown as number) ? date : new Date());

	return new Date(Date.UTC(
		d.getUTCFullYear(),
		d.getUTCMonth(),
		d.getUTCDate(),
		d.getUTCHours(),
		d.getUTCMinutes(),
		d.getUTCSeconds(),
		d.getUTCMilliseconds(),
	))
};
const UTCDate = (date: Date) => new Date(date.toUTCString().slice(0, -4))

const weekdays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
] as const;
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
] as const;


export {
	TSDate,
	UTCDate,
	weekdays,
	months,
}