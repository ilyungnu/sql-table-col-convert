const sqlFileInput = document.getElementById('sqlFileInput');
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

sqlFileInput.addEventListener('input', () => ReadFile(SetSqlBefore, 'UTF-8'));
