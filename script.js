const fileLoaderSql = document.getElementById('fileLoaderSql');
const fileLoaderTable = document.getElementById('fileLoaderTable');

const tableAll = document.querySelectorAll('.file-list, .table-list');
const tableSql = document.querySelector('#tableSql');
const tableCol = document.querySelector('#tableCol');

const sqlBefore = document.getElementById('sqlBefore');

let sqlFiles = {};
let colFiles = {};

//toggle all
const ToggleAll = (TABLE) => {
  const headChkbox = TABLE.querySelector('thead input[type=checkbox]');
  const bodyChkboxes = TABLE.querySelectorAll('tbody input[type=checkbox]');

  headChkbox.addEventListener('change', () => {
    [...bodyChkboxes].map((i) => (i.checked = headChkbox.checked));
  });
};

const DeleteRow = (e) => {
  const row = e.parentNode.parentNode;
  row.parentNode.removeChild(row);
};

const DeleteAllRow = (TABLE) => {
  let delAllBtn = TABLE.querySelector('thead .btn-del-all');

  delAllBtn.addEventListener('click', () => {
    let Chkboxes = TABLE.querySelectorAll('tbody input[type=checkbox]');
    [...Chkboxes].map((i) => {
      if (i.checked) i.closest('tr').remove();
    });
  });
};

//set file table function
[...tableAll].map((e) => {
  ToggleAll(e);
  DeleteAllRow(e);
});

//file read
const ReadFile = (TABLE, STORAGE, ENCODING) => {
  let busyReading = false;

  const inputFiles = [...event.target.files];
  inputFiles.map((FILE) => {
    if (!busyReading) {
      const READER = new FileReader();
      READER.readAsText(FILE, ENCODING); //파일읽기
      READER.onloadstart = function () {
        busyReading = true;
      };
      READER.onload = function () {
        //읽기완료
        AddTable(FILE.name, TABLE);
        STORAGE[FILE.name] = READER.result;
        busyReading = false;
      };
    }
  });

  event.target.value = '';
};

//file set
const AddTable = (FILENAME, TABLE) => {
  const newRow = document.createElement('tr');
  const tableBody = TABLE.querySelector('tbody');
  newRow.innerHTML = `
    <td><input type="checkbox" /></td>
    <td onclick="LoadFile()">${FILENAME}</td>
    <td>
      <button class="btn-del" onclick="DeleteRow(this)">
        <span class="lets-icons--dell-duotone"></span>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);
};

const LoadFile = () => {
  const filename = event.target.innerText;
  sqlBefore.innerHTML = sqlFiles[filename];
};

// add event listener
fileLoaderSql.addEventListener('change', () => ReadFile(tableSql, sqlFiles, 'UTF-8'));
fileLoaderTable.addEventListener('change', () => ReadFile(tableCol, colFiles, 'UTF-8'));
