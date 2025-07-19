import moment from 'moment';

export default function getCountdownFromNow(targetDate) {
  if (!targetDate) return '00h : 00m : 00s';

  const now = moment.utc();
  const target = moment(targetDate);


  const diff = moment.duration(target.diff(now));

  if (diff.asSeconds() <= 0) {
    return '00h : 00m : 00s';
  }

  const hours = String(Math.floor(diff.asHours())).padStart(2, '0');
  const minutes = String(diff.minutes()).padStart(2, '0');
  const seconds = String(diff.seconds()).padStart(2, '0');

  return `${hours}h : ${minutes}m : ${seconds}s`;
}
