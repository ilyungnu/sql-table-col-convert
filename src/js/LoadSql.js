const { inputSql, fileListSql, filenameSql, fileContentSql, sqlFileAdd, sqlFileEdit, sqlFileDownload } = require('./Element');
let { fileSql, loadedFileSql } = require('./Element');

const InputSqlEvt = () => {
  const inputFiles = [...event.target.files];

  // file list is empty
  if (Object.keys(fileSql).length > 0) {
    fileSql = new Object();
    fileListSql.querySelectorAll('tbody tr').forEach((ROW) => ROW.remove());
  }

  // read file
  Promise.all(inputFiles.map((FILE) => ReadFileSql(FILE))).then(() => {
    //show file list
    if (fileListSql.hidden) fileListSql.hidden = false;
    //show first file
    if (fileContentSql.value == '') fileListSql.querySelector('tbody tr:first-child .file-name').click();
  });

  // reset input
  event.target.value = '';
};

const ReadFileSql = (FILE) => {
  return new Promise((resolve) => {
    const READER = new FileReader();

    READER.readAsText(FILE, 'UTF-8');

    READER.onload = () => {
      AddSqlFileRow(FILE.name, fileListSql);
      fileSql[FILE.name] = READER.result; // save file
      resolve();
    };
  });
};

const LoadFileSql = () => {
  const fileItems = fileListSql.querySelectorAll('tbody tr .file-name');
  const filename = event.target.innerText;

  // add css class
  fileItems.forEach((i) => {
    i.innerText == filename ? (i.className += ' chose-file') : i.classList.remove('chose-file');
  });

  // load sql to textarea
  filenameSql.value = filename;
  fileContentSql.value = fileSql[filename];

  loadedFileSql = filename;
};

const DelSqlFileRow = () => {
  const delRow = event.target.closest('tr');
  const delFileName = delRow.querySelector('.file-name').innerText;

  // delete file
  delete fileSql[delFileName];
  delRow.remove();
};

const AddSqlFileRow = (FILENAME, TABLE) => {
  const newRow = document.createElement('tr');
  const tBody = TABLE.querySelector('tbody');

  newRow.innerHTML = `
  <td><input type="checkbox" /></td>
  <td><span class="file-name">${FILENAME}</span></td>
  <td>
    <button class="delete-row-button">
      <span class="lets-icons--dell-duotone"></span>
    </button>
  </td>
`;

  newRow.querySelector('.file-name').addEventListener('click', LoadFileSql);
  newRow.querySelector('.delete-row-button').addEventListener('click', DelSqlFileRow);

  tBody.appendChild(newRow);
};

const SetSqlFileStatus = (FILENAME) => {
  const fileItems = fileListSql.querySelectorAll('tbody tr .file-name');

  // add css class
  fileItems.forEach((i) => {
    i.innerText == FILENAME ? (i.className += ' chose-file') : i.classList.remove('chose-file');
  });

  // set status
  filenameSql.value = FILENAME;
  loadedFileSql = FILENAME;
};

const AddSqlFile = () => {
  const content = fileContentSql.value;

  // add file list
  if (content.trim() != '') {
    let filename = filenameSql.value.trim();

    // set file name
    if (filename == '') filename = 'SQL';
    if (filename.slice(-4) != '.sql') filename += '.sql';

    if (Object.keys(fileSql).includes(filename)) {
      const index = filename.length - 4;
      filename = filename.slice(0, index) + '_복사본' + filename.slice(index);
    }

    // add file
    fileSql[filename] = content;
    AddSqlFileRow(filename, fileListSql);

    // set status
    SetSqlFileStatus(filename);

    //show file list
    if (fileListSql.hidden) fileListSql.hidden = false;
  }
};

const EditSqlFile = () => {
  const content = fileContentSql.value;

  // add file list
  if (content.trim() != '') {
    let filename = filenameSql.value.trim();

    // set file name
    if (filename == '') filename = 'SQL';
    if (filename.slice(-4) != '.sql') filename += '.sql';

    if (Object.keys(fileSql).includes(filename)) {
      fileSql[filename] = content;
    } else {
      AddSqlFile();
    }
  }
};

const DownloadSqlFile = () => {
  const content = fileContentSql.value;

  // download
  if (content.trim() != '') {
    const blob = new Blob([content], { type: 'application/sql' });
    const url = document.createElement('a');

    let filename = filenameSql.value.trim();

    // set file name
    if (filename == '') filename = 'SQL';
    if (filename.slice(-4) != '.sql') filename += '.sql';

    url.download = filename;
    url.href = window.URL.createObjectURL(blob);
    url.style.display = 'none';

    document.body.appendChild(url);
    url.click();
    document.body.removeChild(url);
  }
};

inputSql.addEventListener('change', InputSqlEvt);
sqlFileAdd.addEventListener('click', AddSqlFile);
sqlFileEdit.addEventListener('click', EditSqlFile);
sqlFileDownload.addEventListener('click', DownloadSqlFile);
