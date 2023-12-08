const copyTextToClipboadrd = (text, messageSuccess, messageFail) => {
  if (text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    console.log(messageSuccess);
  } else {
    console.log(messageFail);
  }
};

export default copyTextToClipboadrd;
