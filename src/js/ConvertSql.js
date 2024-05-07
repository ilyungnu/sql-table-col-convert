const { cvtSql, cvtSqlDownload } = require('./Element');
let { fileSql, fileCvt } = require('./Element');

export const ChgConvertBtnState = () => {
  if (Object.keys(fileSql).length > 0 && Object.keys(fileCvt).length > 0) {
    cvtSql.classList.remove('state-disable');
    cvtSql.disabled = false;
  } else {
    cvtSql.className = 'state-disable';
    cvtSql.disabled = true;
  }
};
