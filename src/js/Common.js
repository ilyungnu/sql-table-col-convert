const { tableAll, fileContentCvt } = require('./Element');

const ToggleAll = (TABLE) => {
  const headChk = TABLE.querySelector('thead input[type=checkbox]');

  headChk.addEventListener('change', () => {
    const bodyChk = TABLE.querySelectorAll('tbody input[type=checkbox]');
    bodyChk.forEach((CHK) => {
      CHK.checked = headChk.checked;
    });
  });
};

const DelChkRow = (TABLE) => {
  const btnDelChk = TABLE.querySelector('thead .delete-chkrow-button');

  btnDelChk.addEventListener('click', () => {
    const Chks = TABLE.querySelectorAll('tbody input[type=checkbox]');
    Chks.forEach((CHK) => (CHK.checked ? CHK.closest('tr').querySelector('.delete-row-button').click() : 0));

    TABLE.querySelector('thead input').checked = false;
  });
};

tableAll.forEach((TABLE) => {
  ToggleAll(TABLE);
  DelChkRow(TABLE);
});
