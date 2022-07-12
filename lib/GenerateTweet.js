const generateTweetText = (title, author, url) => {
  const infoTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;
  const authorString = author.join(',');
  const infoAuthor = authorString.length > 30 ? authorString.substring(0, 30) + '...' : authorString;

  const text = `💖 ${infoTitle} / ${infoAuthor} \n ${url} `;

  return text;
};

export default generateTweetText;
