export const makeDOMWithProperties = (domtype, propertyMap) => {
  const dom = document.createElement(domtype);

  if(!propertyMap) return dom;

  Object.keys(propertyMap).forEach((key) => {
    dom[key] = propertyMap[key];
  });

  return dom;
}

export const appendChildernList = (target, childrenList) => {
  if(!Array.isArray(childrenList)) return;

  childrenList.forEach((children) => {
    if(!children) return;
    target.appendChild(children);
  })
}