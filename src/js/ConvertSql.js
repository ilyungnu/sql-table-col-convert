const { toggleRst, cvtSql, cvtSqlDownload } = require('./Globals');
let { fileSql, fileCvt } = require('./Globals');

export const ChgConvertBtnState = () => {
  if (Object.keys(fileSql).length > 0 && Object.keys(fileCvt).length > 0) {
    cvtSql.classList.remove('state-disable');
    cvtSql.disabled = false;
    toggleRst.open = true;
  } else {
    cvtSql.className = 'state-disable';
    cvtSql.disabled = true;
  }
};

const ConvertSql = () => {
  // convert
  console.log(fileSql);

  // add file list

  cvtSqlDownload.classList.remove('state-disable');
  cvtSqlDownload.disabled = false;
};
const DownloadSql = () => {};

cvtSql.addEventListener('click', ConvertSql);
cvtSqlDownload.addEventListener('click', DownloadSql);
