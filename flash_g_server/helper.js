const jwt = require("jsonwebtoken");
// Generate access token
// exprired time 15s
const generateAccessToken = (user) => {
  let token;
  if (user) {
    token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  }
  return token ? token : undefined;
};

// Generate refresh token
// expired time infinity
const generateRefreshToken = (user) => {
  let token;
  if (user) {
    token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  }
  return token ? token : undefined;
};

//Minus Day
const DistanceFromDateToDate = (date1, month1, year1, date2, month2, year2) => {
  const leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const nonLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function distanceBetweenYears(year1, year2) {
    let numLeapYear;
    if (year2 - year1 + 1 >= 4) {
      numLeapYear = Math.floor((year2 - year1 + 1) / 4);
      numLeapYear += year2 % 4 == 0 ? 1 : 0;
    } else {
      if (year1 % 4 == 0 || 4 - (year1 % 4) < year2 - year1 + 1) {
        numLeapYear = 1;
      } else {
        numLeapYear = 0;
      }
    }
    console.log("[numLeapYear]", numLeapYear);
    return numLeapYear * 366 + (year2 - year1 + 1 - numLeapYear) * 365;
  }
  // return số ngayf đã trãi qua của year1 và số ngayf chưa trãi qua của year2
  function distanceBetweenMonths(year1, month1, day1, year2, month2, day2) {
    let dayMonth1 = 0;
    for (i = 1; i < month1; i++) {
      dayMonth1 += year1 % 4 == 0 ? leapYear[i - 1] : nonLeapYear[i - 1];
    }
    dayMonth1 += day1;

    let dayMonth2 = 0;
    for (i = month2 + 1; i <= 12; i++) {
      dayMonth2 += year2 % 4 == 0 ? leapYear[i - 1] : nonLeapYear[i - 1];
    }
    dayMonth2 +=
      year2 % 4 == 0
        ? leapYear[month2 - 1] - day2
        : nonLeapYear[month2 - 1] - day2;

    return {
      dayMonth1,
      dayMonth2,
    };
  }
  const distanceBetMon = distanceBetweenMonths(
    year1,
    month1,
    date1,
    year2,
    month2,
    date2
  );
  return (
    distanceBetweenYears(year1, year2) -
    distanceBetMon.dayMonth1 -
    distanceBetMon.dayMonth2
  );
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  DistanceFromDateToDate,
};
