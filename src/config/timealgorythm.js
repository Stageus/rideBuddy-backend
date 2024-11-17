const now = new Date();
const newDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
const newTime = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

const timeAsInt = parseInt(newTime, 10);

let formattedTime0;
let formattedDate0;

// 날짜 조정 함수
function adjustDateForPreviousDay(date) {
  const prevDay = new Date(date); // 현재 날짜 복사
  prevDay.setDate(prevDay.getDate() - 1); // 하루 전으로 설정
  const year = prevDay.getFullYear();
  const month = String(prevDay.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(prevDay.getDate()).padStart(2, '0');
  return `${year}${month}${day}`; // YYYYMMDD 형식 반환
}

if (timeAsInt >= 2315 || timeAsInt <= 15) {
  formattedTime0 = '2000';
  formattedDate0 = adjustDateForPreviousDay(now); // 전날로 이동
} else if (15 < timeAsInt && timeAsInt <= 215) {
  formattedTime0 = '2300';
  formattedDate0 = adjustDateForPreviousDay(now); // 전날로 이동
} else if (215 < timeAsInt && timeAsInt <= 515) {
  formattedTime0 = '0200';
  formattedDate0 = newDate; // 같은 날짜 유지
} else if (515 < timeAsInt && timeAsInt <= 815) {
  formattedTime0 = '0500';
  formattedDate0 = newDate;
} else if (815 < timeAsInt && timeAsInt <= 1115) {
  formattedTime0 = '0800';
  formattedDate0 = newDate;
} else if (1115 < timeAsInt && timeAsInt <= 1415) {
  formattedTime0 = '1100';
  formattedDate0 = newDate;
} else if (1415 < timeAsInt && timeAsInt <= 1715) {
  formattedTime0 = '1400';
  formattedDate0 = newDate;
} else if (1715 < timeAsInt && timeAsInt <= 2015) {
  formattedTime0 = '1700';
  formattedDate0 = newDate;
} else if (2015 < timeAsInt && timeAsInt <= 2315) {
  formattedTime0 = '2000';
  formattedDate0 = newDate;
}
let formattedTime9;
let formattedDate9;

if (timeAsInt % 100 >= 46) {
  // 현재 시각에서 '30분 단위'로 내림
  let hours = Math.floor(timeAsInt / 100); // 시 추출
  let minutes = 30;
  formattedDate9 = newDate;
  formattedTime9 = `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}`;
} else {
  // '30분 미만'인 경우, 이전 시간의 30분으로 이동
  let hours = Math.floor(timeAsInt / 100) - 1; // 한 시간 감소
  let minutes = 30;
  formattedDate9 = newDate;
  if (hours < 0) {
    // 00시 이전이면 전날로 이동
    hours = 23;
    formattedDate9 = adjustDateForPreviousDay(now);
  }

  formattedTime9 = `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}`;
}

export const formattedTime1 = formattedTime9;
export const formattedDate1 = formattedDate9;
export const formattedTime2 = formattedTime0;
export const formattedDate2 = formattedDate0;
