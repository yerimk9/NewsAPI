// NewsList.js
import { makeDOMWithProperties, appendChildernList } from "./dom.js";

class NewsList {
  constructor() {
    this.category = "all";
    this.page = 1;
    this.pageSize = 5;
    this.isLoading = false; // 로딩 중인지 여부를 나타내는 플래그
    this.lastPage = 0; // 마지막 페이지 수
    this.scrollObserver = null; // IntersectionObserver 객체
  }

  async getNews(category, page, pageSize) {
    if (this.isLoading) return; // 이미 로딩 중인 경우 중복 호출 방지

    this.isLoading = true; // 로딩 상태로 변경

    const newslist = document.querySelector(".news-list");
    const apiKey = "13475a9ff97a45219e9263ce34b08490";
    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${category === "all" ? "" : category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

    let response;
    try {
      response = await axios.get(url);
      console.log(response);

      response.data.articles.forEach((article) => {
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
      });

      // 마지막 페이지인 경우 로더 제거 및 IntersectionObserver 해제
      if (response.data.totalResults <= page * pageSize) {
        this.lastPage = page;
        this.removeLoader();
        this.disconnectObserver();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false; // 로딩 상태 해제
    }
  }

  renderNewsList(container) {
    const newsListContainer = makeDOMWithProperties("div", { className: "news-list-container" });
    const article = makeDOMWithProperties("article", { className: "news-list" });
    const scrollObserver = makeDOMWithProperties("div", { className: "scroll-observer" });
    const loadingImage = makeDOMWithProperties("img", { src: "img/ball-triangle.svg", alt: "Loading..." });

    scrollObserver.appendChild(loadingImage);
    appendChildernList(newsListContainer, [article, scrollObserver]);
    container.appendChild(newsListContainer);
  }

  clearNewsList() {
    const newslist = document.querySelector(".news-list");
    newslist.innerHTML = "";
  }

  removeLoader() {
    const loader = document.querySelector(".scroll-observer");
    loader.remove();
  }

  disconnectObserver() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();  // disconnect() : IntersectionObserver객체의 메서드로, 해당 객체와 관련된 모든 관찰을 중단시키는 역할 
    }
  }

  scrollObserver() {
    const target = document.querySelector(".scroll-observer");
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    this.scrollObserver = new IntersectionObserver(() => {
      this.page++;
      this.getNews(this.category, this.page, this.pageSize);
    }, options);
    this.scrollObserver.observe(target);
  }
}

export default NewsList;
