import { select } from 'd3';
import { observeResize } from '@curran/responsive-axes';
import { parallelCoordinates } from './parallelCoordinates';
import { data } from '@ayush-shinde/eafc24ratings';

data.forEach((d, i) => {
  d.id = i;
});

const columns = [
  'pace',
  'shooting',
  'passing',
  'dribbling',
  'defending',
  'physic',
];

const columnTypes = {
  pace: 'quantitative',
  shooting: 'quantitative',
  passing: 'quantitative',
  dribbling: 'quantitative',
  defending: 'quantitative',
  physic: 'quantitative',
};

const colorValue = (d) => d.club_name;
const idValue = (d) => d.id;

export const main = (container, { state, setState }) => {
  const dimensions = observeResize({
    state,
    setState,
    container,
  });

  if (dimensions === null) return;

  const { width, height } = dimensions;

  if (!state.brushedIntervals) {
    setState((state) => ({
      ...state,
      brushedIntervals: {},
    }));
  }

  const { brushedIntervals } = state;

  const updateBrushedInterval = ({ column, interval }) => {
    setState((state) => ({
      ...state,
      brushedIntervals: {
        ...state.brushedIntervals,
        [column]: interval,
      },
    }));
  };

  const tooltip = select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background', 'white')
    .style('border', '1px solid black')
    .style('border-radius', '5px')
    .style('padding', '10px')
    .style('pointer-events', 'none');

  const svg = select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#333');

  parallelCoordinates(svg, {
    data,
    columns,
    columnTypes,
    colorValue,
    idValue,
    width,
    height,
    brushedIntervals,
    updateBrushedInterval,
    tooltip,
  });
};
