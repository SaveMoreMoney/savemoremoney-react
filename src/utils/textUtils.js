export const decodeHTMLEntities = (text) => {
  if (!text) return '';
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

export const extractExcerpt = (htmlContent, maxLength = 100) => {
  if (!htmlContent) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  let text = tempDiv.textContent || tempDiv.innerText || '';
  text = decodeHTMLEntities(text);
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
