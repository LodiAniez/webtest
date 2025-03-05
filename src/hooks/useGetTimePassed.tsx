import { isValidDate, } from '@/utils/functions';
import { TSDate } from '@/utils/variables';
import { Timestamp } from 'firebase/firestore';
import { useState, useEffect, useContext, useMemo } from 'react';

function useGetTimePassed(date: Date | Timestamp = TSDate()) {
  const [timeAgo, setTimeAgo] = useState('');
  // const d = useMemo(() => setDateToTimezone((date instanceof Timestamp ? TSDate(date) : isValidDate(date) ? date : TSDate()), RetreatCenter?.timezone), [date, RetreatCenter])
  useEffect(() => setTimeAgo(getTimePassed(date)), [date]);

  return timeAgo;
}
export const getTimePassed = (date?: Date | Timestamp) => {
  const now = new Date();
  const diff = now.getTime() - (date instanceof Timestamp ? TSDate(date) : isValidDate(date) ? date : TSDate()).getTime();

  let years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
  let months = Math.floor((diff % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
  let days = Math.floor((diff % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
  let hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  let minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  let seconds = Math.floor((diff % (60 * 1000)) / 1000);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;

  return 'just now';
};

export const getTimeRemaining = (date1: Date, date2: Date = TSDate()): string => {
  const diffInMs = Math.abs(date2.getTime() - TSDate(date1).getTime());

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  const units: string[] = [];
  if (days > 0) units.push(`${days} day${days > 1 ? 's' : ''}`);
  if (days === 0 && hours > 0) units.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (days === 0 && minutes > 0) units.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (days === 0 && hours < 2 && seconds > 0) units.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

  return units.join(', ');
}

export default useGetTimePassed;
