const { toggleRst, cvtSql, cvtSqlDownload, fileListRst, filenameRst, fileContentRst } = require('./Globals');
let { fileSql, fileCvt, fileRst } = require('./Globals');

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

function ConvertContent(bfTable, bfCol, afTable, afCol) {
  this.bfTable = bfTable;
  this.bfCol = [bfCol];
  this.afTable = afTable;
  this.afCol = [afCol];
}

const ConvertCvt = () => {
  // convert file
  const firstCvtFileKey = Object.keys(fileCvt)[0];
  const cvtFileRaw = fileCvt[firstCvtFileKey].map((i) => (i = i.split(',')));

  let cvtContent = new Array();

  cvtFileRaw.map((i) => {
    const index = cvtContent.findIndex((e) => e.bfTable == i[0]);

    if (index > -1) {
      cvtContent[index].bfCol.push(i[1]);
      cvtContent[index].afCol.push(i[3]);
    } else {
      cvtContent.push(new ConvertContent(i[0], i[1], i[2], i[3]));
    }
  });

  return cvtContent;
};

const ChgKey = (OBJ) => {
  let fileChgKey = OBJ;

  for (let i in fileChgKey) {
    const newFilename = i.slice(0, -4) + '_convert.csv';
    fileChgKey[newFilename] = fileChgKey[i];
    delete fileChgKey[i];
  }

  return fileChgKey;
};

const ConvertSql = (ConvertContent) => {
  // sql file
  const sqlFileRaw = fileSql;

  // sql file repeat
  for (let i in sqlFileRaw) {
    // convert file repeat(tables)
    ConvertContent.map((e) => {
      const regBfTable = new RegExp('(?<=(\\s|,))(' + e.bfTable + ')(?=(\\s|$|,))', 'g');

      if (regBfTable.test(sqlFileRaw[i])) {
        sqlFileRaw[i] = sqlFileRaw[i].replaceAll(regBfTable, e.afTable);

        // convert file repeat(cols)
        for (let j in e.bfCol) {
          const regBfCol = new RegExp('(?<=(\\s|,))(' + e.bfCol[j] + ')', 'g');
          const regBfColWithTable = new RegExp('(' + e.bfTable + ').(' + e.bfCol[j] + ')', 'g');

          sqlFileRaw[i] = sqlFileRaw[i].replaceAll(regBfCol, e.afCol);
          sqlFileRaw[i] = sqlFileRaw[i].replaceAll(regBfColWithTable, e.afTable + '.' + e.afCol[j]);
        }
      }
    });
  }

  return ChgKey(sqlFileRaw);
};

const LoadFileCvt = () => {
  const fileItems = fileListRst.querySelectorAll('tbody tr .file-name');
  const filename = event.target.innerText;

  // add css class
  fileItems.forEach((i) => {
    i.innerText == filename ? (i.className += ' chose-file') : i.classList.remove('chose-file');
  });

  // load sql to textarea
  filenameRst.value = filename;
  fileContentRst.value = fileRst[filename];
};

const DelCvtFileRow = () => {
  const delRow = event.target.closest('tr');
  const delFileName = delRow.querySelector('.file-name').innerText;

  // delete file
  delete fileRst[delFileName];
  delRow.remove();
};

const AddCvtFileRow = (FILENAME) => {
  const newRow = document.createElement('tr');
  const tBody = fileListRst.querySelector('tbody');

  newRow.innerHTML = `
  <td><input type="checkbox" name="select_file_sql"/></td>
  <td><span class="file-name">${FILENAME}</span></td>
  <td>
    <button class="delete-row-button">
      <span class="lets-icons--dell-duotone"></span>
    </button>
  </td>
`;

  newRow.querySelector('.file-name').addEventListener('click', LoadFileCvt);
  newRow.querySelector('.delete-row-button').addEventListener('click', DelCvtFileRow);

  tBody.appendChild(newRow);
};

const ConvertCvtSql = () => {
  const cvtContent = ConvertCvt();
  fileRst = ConvertSql(cvtContent);

  // add file list row
  for (let i in fileRst) AddCvtFileRow(i);

  //show file list
  if (fileListRst.hidden) fileListRst.hidden = false;
  //show first file
  fileListRst.querySelector('tbody tr:first-child .file-name').click();

  // set download button
  cvtSqlDownload.classList.remove('state-disable');
  cvtSqlDownload.disabled = false;
};

const DownloadSql = () => {};

cvtSql.addEventListener('click', ConvertCvtSql);
cvtSqlDownload.addEventListener('click', DownloadSql);
