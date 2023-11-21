import { makeDOMWithProperties, appendChildernList } from "./dom.js";

class NewsList {
  constructor() {
    this.category = 'all';
    this.page = 1;
    this.pageSize = 5;
  }

  async getNews(category, page, pageSize) {
    const newslist = document.querySelector('.news-list');
    const apiKey = '13475a9ff97a45219e9263ce34b08490';
    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${category === 'all' ? '' : category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`
    
    let response;
      try {
        response = await axios.get(url);

        response.data.articles.forEach(article => {
          const section = makeDOMWithProperties("section", { className: "news-item" });
          const thumbnail = makeDOMWithProperties("div", { className: "thumbnail" });
          const thumbnailLink = makeDOMWithProperties("a", { href: article.url, target: "_blank", rel: "noopener noreferrer" });
          
          // 이미지 대체 처리
          const thumbnailImageSrc = article.urlToImage ? article.urlToImage : `data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
          const thumbnailImage = makeDOMWithProperties("img", { src: thumbnailImageSrc, alt: "thumbnail" });
          
          thumbnailLink.appendChild(thumbnailImage);
          thumbnail.appendChild(thumbnailLink);
          const contents = makeDOMWithProperties("div", { className: "contents" });
          const heading = makeDOMWithProperties("h2");
          const headingLink = makeDOMWithProperties("a", { href: article.url, target: "_blank", rel: "noopener noreferrer" });
          headingLink.innerText = article.title;
          heading.appendChild(headingLink);
          
          // 설명 대체 처리
          const descriptionText = article.description ? article.description : "";
          const paragraph = makeDOMWithProperties("p");
          paragraph.innerText = descriptionText;
          
          appendChildernList(contents, [heading, paragraph]);
          appendChildernList(section, [thumbnail, contents]);
          newslist.appendChild(section);
        })
      } catch (error) {
        console.log(error);
      }
  }

  renderNewsList(container) {
    
    const newsListContainer = makeDOMWithProperties('div', { className : 'news-list-container' });
    const article = makeDOMWithProperties('article', { className : 'news-list' });
    const scrollObserver = makeDOMWithProperties('div', { className : 'scroll-observer' });
    const loadingImage = makeDOMWithProperties('img', { src: "img/ball-triangle.svg", alt: "Loading..." });

    scrollObserver.appendChild(loadingImage);
    appendChildernList(newsListContainer, [article, scrollObserver]);
    container.appendChild(newsListContainer);
  }

  clearNewsList() {
    const newslist = document.querySelector('.news-list');
    newslist.innerHTML = '';
  }
}

export default NewsList;
