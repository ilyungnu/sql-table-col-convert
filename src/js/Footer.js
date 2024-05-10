const { contactEmail } = require('./Globals');

contactEmail.addEventListener('click', () => {
  window.navigator.clipboard.writeText(contactEmail.innerText).then(() => {
    /* copy complete */
  });
});
