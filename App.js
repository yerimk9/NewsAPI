// App.js
import { Nav, NewsList } from "./components/index.js";

const root = document.querySelector("#root");

// Nav
const nav = new Nav();
nav.renderNav(root);

// NewsList
const newsList = new NewsList();
newsList.renderNewsList(root);

// Menu
document.querySelector("nav").addEventListener("click", (event) => {
  if (event.target.className === "category-item") {
    const activeItem = document.querySelector(".active");
    if (activeItem) {
      activeItem.classList.remove("active");
    }
    event.target.classList.add("active");
    newsList.clearNewsList();
    NewsProxy.category = event.target.id;
    NewsProxy.page = 1;
    notify(); // 변경 사항 알림
  }
});

// Proxy
const NewsProxy = new Proxy(newsList, {
  set: (target, property, value) => {
    target[property] = value;
    notify(); // 변경 사항 알림
    return true;
  },
});

// Scroll
function scrollObserver() {
  let target = document.querySelector(".scroll-observer");
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };
  let observer = new IntersectionObserver(() => {
    NewsProxy.page++;
    newsList.getNews(NewsProxy.category, NewsProxy.page, NewsProxy.pageSize);
  }, options);
  observer.observe(target);
}

window.onload = function () {
  scrollObserver();
  subscribe(() => {
    if (newsList.page <= newsList.lastPage) {
      newsList.getNews(newsList.category, newsList.page, newsList.pageSize);
    }
  });
};

const observers = [];

function subscribe(observer) {
  observers.push(observer);
}

function notify() {
  observers.forEach((observer) => observer());
}
