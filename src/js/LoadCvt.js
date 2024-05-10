const { inputCvt, fileListCvt, filenameCvt, fileContentCvt, cvtContentAddRow, cvtFileAdd, cvtFileEdit, cvtFileDownload } = require('./Globals');
let { fileCvt } = require('./Globals');

const { ChgConvertBtnState } = require('./ConvertSql');

const InputCvtEvt = () => {
  const inputFiles = [...event.target.files];

  // file list is empty
  if (Object.keys(fileCvt).length > 0) {
    fileCvt = new Object();
    fileListCvt.querySelectorAll('tbody tr').forEach((ROW) => ROW.remove());
  }

  // read file
  Promise.all(inputFiles.map((FILE) => ReadFileCvt(FILE))).then(() => {
    //show file list
    if (fileListCvt.hidden) fileListCvt.hidden = false;
    //show first file
    if (IsCvtContentClear()) {
      fileListCvt.querySelector('tbody tr:first-child .file-name').click();
    }

    ChgConvertBtnState();
  });

  // reset input
  event.target.value = '';
};

const IsCvtContentClear = () => {
  const inputs = fileContentCvt.querySelectorAll('tbody input[type=text]');

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() !== '') return false;
  }
  return true;
};

const ReadFileCvt = (FILE) => {
  return new Promise((resolve) => {
    const READER = new FileReader();

    READER.readAsText(FILE, 'UTF-8');

    READER.onload = () => {
      AddCvtFileRow(FILE.name, fileListCvt);
      fileCvt[FILE.name] = READER.result // save file
        .split('\r\n')
        .filter(Boolean)
        .map((i) => i.trim());
      resolve();
    };
  });
};

const LoadFileCvt = () => {
  const fileItems = fileListCvt.querySelectorAll('tbody tr .file-name');

  // add css class
  const filename = event.target.innerText;
  fileItems.forEach((i) => {
    i.innerText == filename ? (i.className += ' chose-file') : i.classList.remove('chose-file');
  });

  // load convert contents to table
  fileContentCvt.querySelectorAll('tbody tr').forEach((i) => i.remove());

  filenameCvt.value = filename;
  LoadCvtContent(filename);
};

const UpdateRowNum = () => {
  const rows = fileContentCvt.querySelectorAll('tbody tr');

  rows.forEach((i, index) => {
    i.querySelectorAll('td')[1].textContent = index + 1;
  });
};

const DelCvtContentRow = () => {
  const delRow = event.target.closest('tr');

  delRow.remove();
  UpdateRowNum();

  InitCvtContent();
};

const LoadCvtContent = (FILENAME) => {
  const tBody = fileContentCvt.querySelector('tbody');

  fileCvt[FILENAME].map((i) => {
    const newRow = document.createElement('tr');
    const itemArry = i.split(',');
    const num = tBody.querySelectorAll('tr').length + 1;

    newRow.innerHTML = `
    <td><input type="checkbox" name="select_file_cvt_content"/></td>
    <td>${num}</td>
    <td><input type="text" value="${itemArry[0]}"/></td>
    <td><input type="text" value="${itemArry[1]}"/></td>
    <td><input type="text" value="${itemArry[2]}"/></td>
    <td><input type="text" value="${itemArry[3]}"/></td>
    <td>
      <button class="delete-row-button">
        <span class="lets-icons--dell-duotone"></span>
      </button>
    </td>
  `;
    newRow.querySelector('.delete-row-button').addEventListener('click', DelCvtContentRow);

    tBody.appendChild(newRow);
  });
};

const DelCvtFileRow = () => {
  const delRow = event.target.closest('tr');
  const delFileName = delRow.querySelector('.file-name').innerText;

  // delete file
  delete fileCvt[delFileName];
  delRow.remove();

  ChgConvertBtnState();
};

const AddCvtFileRow = (FILENAME, TABLE) => {
  const newRow = document.createElement('tr');
  const tBody = TABLE.querySelector('tbody');

  newRow.innerHTML = `
  <td><input type="checkbox" name="select_file_cvt"/></td>
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

const AddCvtContentRow = () => {
  const newRow = document.createElement('tr');
  const tBody = fileContentCvt.querySelector('tbody');
  const num = tBody.querySelectorAll('tr').length + 1;

  newRow.innerHTML = `
    <td><input type="checkbox" name="select_file_cvt_content" /></td>
    <td>${num}</td>
    <td><input type="text" value="" name="table_before"/></td>
    <td><input type="text" value="" name="column_before"/></td>
    <td><input type="text" value="" name="table_after"/></td>
    <td><input type="text" value="" name="column_after"/></td>
    <td>
      <button class="delete-row-button">
        <span class="lets-icons--dell-duotone"></span>
      </button>
    </td>
  `;
  newRow.querySelector('.delete-row-button').addEventListener('click', DelCvtContentRow);

  tBody.appendChild(newRow);
};

const InitCvtContent = () => {
  const rows = fileContentCvt.querySelectorAll('tbody tr');
  if (rows.length == 0) AddCvtContentRow();
};

const IsCvtContentEmpty = () => {
  const inputs = fileContentCvt.querySelectorAll('tbody input[type=text]');

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() == '') return true;
  }
  return false;
};

const SetCvtFileStatus = (FILENAME) => {
  const fileItems = fileListCvt.querySelectorAll('tbody tr .file-name');

  // add css class
  fileItems.forEach((i) => {
    i.innerText == FILENAME ? (i.className += ' chose-file') : i.classList.remove('chose-file');
  });

  // set status
  filenameCvt.value = FILENAME;
};

const AddCvtFile = () => {
  if (!IsCvtContentEmpty()) {
    let content = '';
    const rows = fileContentCvt.querySelectorAll('tbody tr');

    rows.forEach((ROW) => {
      const rowVal = [...ROW.querySelectorAll('input[type=text]')].map((i) => i.value);
      content += rowVal.join(',') + '\n';
    });

    // set file name
    let filename = SetFileName(filenameCvt.value);

    if (Object.keys(fileCvt).includes(filename)) {
      const index = filename.length - 4;
      filename = filename.slice(0, index) + '_복사본' + filename.slice(index);
    }

    // add file
    fileCvt[filename] = content
      .split('\n')
      .filter(Boolean)
      .map((i) => i.trim());
    AddCvtFileRow(filename, fileListCvt);

    // set status
    SetCvtFileStatus(filename);
    ChgConvertBtnState();

    //show file list
    if (fileListCvt.hidden) fileListCvt.hidden = false;
  }
};

const EditCvtFile = () => {
  if (!IsCvtContentEmpty()) {
    let content = '';
    const rows = fileContentCvt.querySelectorAll('tbody tr');

    rows.forEach((ROW) => {
      const rowVal = [...ROW.querySelectorAll('input[type=text]')].map((i) => i.value);
      content += rowVal.join(',') + '\n';
    });

    // set file name
    let filename = SetFileName(filenameCvt.value);

    if (Object.keys(fileCvt).includes(filename)) {
      fileCvt[filename] = content
        .split('\n')
        .filter(Boolean)
        .map((i) => i.trim());
    } else {
      AddCvtFile();
    }
  }
};

const DownloadCvtFile = () => {
  if (!IsCvtContentEmpty()) {
    let content = '';
    const rows = fileContentCvt.querySelectorAll('tbody tr');

    rows.forEach((ROW) => {
      const rowVal = [...ROW.querySelectorAll('input[type=text]')].map((i) => i.value);
      content += rowVal.join(',') + '\n';
    });

    // create csv file
    const blob = new Blob([content], { type: 'application/csv' });
    const url = document.createElement('a');

    // set file name
    let filename = SetFileName(filenameCvt.value);

    url.download = filename;
    url.href = window.URL.createObjectURL(blob);
    url.style.display = 'none';

    document.body.appendChild(url);
    url.click();
    document.body.removeChild(url);
  }
};

const SetFileName = (STR) => {
  let filename = STR.trim();

  if (STR == '') STR = 'CSV';
  if (!/.csv/gi.test(STR.slice(-4))) STR += '.csv';

  return filename;
};

inputCvt.addEventListener('change', InputCvtEvt);
cvtContentAddRow.addEventListener('click', AddCvtContentRow);
cvtFileAdd.addEventListener('click', AddCvtFile);
cvtFileEdit.addEventListener('click', EditCvtFile);
cvtFileDownload.addEventListener('click', DownloadCvtFile);

InitCvtContent();
