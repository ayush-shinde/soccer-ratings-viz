import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://raw.githubusercontent.com/ayush-shinde/soccer-ratings-viz/master/epl_players.csv';

const parseRow = (d) => {
  d.overall = +d.overall;
  d.pace = +d.pace;
  d.shooting = +d.shooting;
  d.passing = +d.passing;
  d.dribbling = +d.dribbling;
  d.defending = +d.defending;
  d.physic = +d.physic;

  const playerName = d.long_name.split(' ');
  d.PLAYERX = playerName[0] + '.' + playerName[1][0];
  return d;
};

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    csv(csvUrl, parseRow).then(setData);
  }, []);

  return data;
};
