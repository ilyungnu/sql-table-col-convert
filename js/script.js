/********** element */
// button
const inputSql = document.getElementById('inputSql');
const inputCvt = document.getElementById('inputCvt');
const btnCvt = document.getElementById('btnCvt');
const btnDownload = document.getElementById('btnDownload');

// file list
const tableAll = document.querySelectorAll('.file-table, .convert-table');
const tableSqlFile = document.getElementById('tableSqlFile');
const tableCvtFile = document.getElementById('tableCvtFile');
const tableResultFIle = document.getElementById('tableResultFIle');

// file content
const filenameSql = document.getElementById('filenameSql');
const txtareaSql = document.getElementById('txtareaSql');
const tableCvt = document.getElementById('tableCvt');
const txtareaResult = document.getElementById('txtareaResult');

// file
let sqlFiles = {};
let cvtFiles = {};

/********** basic table function */
// toggle all
const ToggleAll = (TABLE) => {
  const headChk = TABLE.querySelector('thead input[type=checkbox]');
  const bodyChk = TABLE.querySelectorAll('tbody input[type=checkbox]');

  headChk.addEventListener('change', () => {
    [...bodyChk].map((i) => (i.checked = headChk.checked));
  });
};

// delete checked rows
const DelChkRow = (TABLE) => {
  let delChkBtn = TABLE.querySelector('thead .delete-chkrow-button');

  delChkBtn.addEventListener('click', () => {
    let Chkboxes = TABLE.querySelectorAll('tbody input[type=checkbox]');
    [...Chkboxes].map((i) => {
      if (i.checked) i.closest('tr').remove();
    });
  });
};

// set functions
[...tableAll].map((e) => {
  ToggleAll(e);
  DelChkRow(e);
});

/********** dynamic table function */
// common
const DelRow = (e) => {
  const row = e.parentNode.parentNode;
  row.parentNode.removeChild(row);
};

// sql table
const InputSqlEvt = () => {
  sqlFiles = {};
  [...tableSqlFile.querySelectorAll('tbody tr')].map((i) => i.remove());
  ReadSqlFile(event);

  // tableSqlFile.querySelector('tbody > tr:first-child > .file-name').click();

  if (tableSqlFile.hidden) {
    tableSqlFile.hidden = false;
  }
};

const ReadSqlFile = (EVENT) => {
  let busyReading = false;
  const inputFiles = [...EVENT.target.files];

  inputFiles.map((FILE) => {
    if (!busyReading) {
      const READER = new FileReader();
      // read file
      READER.readAsText(FILE, 'UTF-8');
      // set reader condition
      READER.onloadstart = () => (busyReading = true);
      // read complete
      READER.onload = () => {
        AddSqlRow(FILE.name, tableSqlFile);
        sqlFiles[FILE.name] = READER.result;
        busyReading = false;
      };
    }
  });

  EVENT.target.value = '';
};

const AddSqlRow = (FILENAME, TABLE) => {
  const newRow = document.createElement('tr');
  const tableBody = TABLE.querySelector('tbody');
  newRow.innerHTML = `
    <td><input type="checkbox" /></td>
    <td class='file-name' onclick="LoadSqlFile()">${FILENAME}</td>
    <td>
      <button class="delete-button" onclick="DelRow(this)">
        <span class="lets-icons--dell-duotone"></span>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);
};

const LoadSqlFile = () => {
  const fileItem = event.target;
  const fileItems = fileItem.closest('tbody').querySelectorAll('tr > .file-name');
  const filename = fileItem.innerText;

  [...fileItems].map((i) => (i.innerText == filename ? (i.className += ' label-active-state') : i.classList.remove('label-active-state')));
  filenameSql.innerHTML = filename;
  txtareaSql.innerHTML = sqlFiles[filename];
};

// convert table
const InputCvtEvt = () => {
  cvtFiles = {};
  tableCvtFile.querySelector('tbody > tr').remove();

  ReadCvtFile(event);
};

const ReadCvtFile = () => {
  let busyReading = false;
  const inputFiles = [...event.target.files];

  inputFiles.map((FILE) => {
    if (!busyReading) {
      const READER = new FileReader();
      // read file
      READER.readAsText(FILE, 'ANSI');
      // set reader condition
      READER.onloadstart = () => (busyReading = true);
      // read complete
      READER.onload = () => {
        AddCvtRow(FILE.name, tableCvtFile);
        cvtFiles[FILE.name] = READER.result;
        busyReading = false;

        if (tableCvtFile.hidden) {
          tableCvtFile.hidden = false;
        }
      };
    }
  });

  event.target.value = '';
};

const AddCvtRow = (FILENAME, TABLE) => {
  const newRow = document.createElement('tr');
  const tableBody = TABLE.querySelector('tbody');
  newRow.innerHTML = `
    <td><input type="checkbox" /></td>
    <td class='file-name' onclick="LoadCvtFile()">${FILENAME}</td>
    <td>
      <button class="delete-button" onclick="DelRow(this)">
        <span class="lets-icons--dell-duotone"></span>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);
};

const LoadCvtFile = () => {
  const fileItem = event.target;
  fileItem.className += ' label-active-state';
};

// event listener
inputSql.addEventListener('change', () => InputSqlEvt());
inputCvt.addEventListener('change', () => ReadCvtFile());
