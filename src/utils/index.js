export const getFishText = () =>
  /* TODO: может получить пустую строку */
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
    .reduce((set, sentance) => {
      if (set.length < 3 && Math.random() < 0.25) {
        set.push(sentance);
      }
      return set;
    }, [])
    .join(` `);

export const getRandomDate = (startDate) => {
  const from = new Date(startDate).getTime();
  const to = Date.now();
  return new Date(from + Math.random() * (to - from));
};

export const formatRuntime = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.round(ms / (1000 * 60)) % 60;
  return {hours, minutes};
};
