const { contactEmail } = require('./Element');

contactEmail.addEventListener('click', () => {
  window.navigator.clipboard.writeText(contactEmail.innerText).then(() => {
    /* copy complete */
  });
});
