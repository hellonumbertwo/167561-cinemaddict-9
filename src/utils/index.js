export const render = (nodeId, element, place) => {
  const container = document.getElementById(nodeId);
  if (container) {
    switch (place) {
      case `afterbegin`:
        container.prepend(element);
        break;
      case `beforeend`:
        container.append(element);
        break;
      case `afterend`:
        container.after(element);
        break;
    }
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const createElement = (template) => {
  const newTemplate = document.createElement(`template`);
  newTemplate.innerHTML = template;
  return newTemplate.content.firstElementChild;
};

export const getFishText = () =>
  // 1-3 рандомных предложения, но обязательно хотя бы одно
  [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ]
    .sort(() => Math.random() - Math.random())
    .slice(0, Math.ceil(Math.random() * 3))
    .join(` `);

export const getRandomDate = (startDate) => {
  const from = new Date(startDate).getTime();
  const to = Date.now();
  return new Date(from + Math.random() * (to - from));
};

export const formatDuration = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.round(ms / (1000 * 60)) % 60;
  return {hours, minutes};
};
