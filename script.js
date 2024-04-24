const sqlFileLoader = document.getElementById('sqlFileLoader');
const tableFileLoader = document.getElementById('tableFileLoader');
const sqlBefore = document.getElementById('sqlBefore');

const ReadFile = (CALLBACK, ENCODING) => {
  const READER = new FileReader();
  const FILENAME = event.target.files[0].name;

  READER.readAsText(event.target.files[0], ENCODING); //파일읽기
  READER.onload = function () {
    //읽기완료
    CALLBACK(READER, FILENAME);
  };
};

const SetSqlBefore = (CONTENT, FILENAME) => {
  sqlBefore.value = CONTENT.result;
};
const SetTableBefore = (CONTENT, FILENAME) => {
  console.log(CONTENT.result);
  // sqlBefore.value = CONTENT.result;
};

sqlFileLoader.addEventListener('input', () => ReadFile(SetSqlBefore, 'UTF-8'));
tableFileLoader.addEventListener('input', () => ReadFile(SetTableBefore, 'UTF-8'));
