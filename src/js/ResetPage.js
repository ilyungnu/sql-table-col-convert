const { btnResetPage } = require('./Globals');

// file list
const { fileListSql, fileListCvt, fileListRst } = require('./Globals');
// file content
const { filenameSql, filenameCvt, filenameRst, fileContentSql, fileContentCvt, fileContentRst } = require('./Globals');
// result part
const { toggleRst, cvtSql, cvtSqlDownload } = require('./Globals');
// files
let { fileCvt, fileSql, fileRst } = require('./Globals');

btnResetPage.addEventListener('click', () => {
  // hide file list
  // fileListSql.hidden = true;
  // fileListCvt.hidden = true;
  // fileListRst.hidden = true;

  // clear file list
  fileListSql.querySelector('thead input[type=checkbox]').click();
  fileListSql.querySelector('thead .delete-chkrow-button').click();
  fileListCvt.querySelector('thead input[type=checkbox]').click();
  fileListCvt.querySelector('thead .delete-chkrow-button').click();
  fileListRst.querySelector('thead input[type=checkbox]').click();
  fileListRst.querySelector('thead .delete-chkrow-button').click();

  // clear convert content table
  fileContentCvt.querySelector('thead input[type=checkbox]').click();
  fileContentCvt.querySelector('thead .delete-chkrow-button').click();

  // clear file content
  filenameSql.value = '';
  filenameCvt.value = '';
  filenameRst.value = '';
  fileContentSql.value = '';
  fileContentCvt.value = '';
  fileContentRst.value = '';

  //reset result part
  toggleRst.open = false;
  cvtSql.className = 'state-disable';
  cvtSql.disabled = true;
  cvtSqlDownload.className = 'state-disable';
  cvtSqlDownload.disabled = true;

  // clear file
  fileSql = new Object();
  fileCvt = new Object();
  fileRst = new Object();

  // scroll to top
  window.scrollTo(0, 0);
});
