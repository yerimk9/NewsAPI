import { makeDOMWithProperties } from "./dom.js";

export default class Nav {
  renderNav(container) {
    const categoryList = makeDOMWithProperties('nav', { className: 'category-list' });
    const ul = makeDOMWithProperties('ul');

    const categoriesKo = ['전체보기', '비즈니스', '엔터테인먼트', '건강', '과학', '스포츠', '기술'];
    const categoriesEn = ['all', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

    categoriesKo.forEach((category, index) => {
      const categoryItem = makeDOMWithProperties('li', { className: 'category-item', id: categoriesEn[index] });
      categoryItem.innerText = category;
      ul.appendChild(categoryItem);
    });

    categoryList.appendChild(ul);
    container.appendChild(categoryList);
  }
}