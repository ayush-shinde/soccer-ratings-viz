import {
  select,
  transition,
  scaleLinear,
  scalePoint,
  scaleOrdinal,
  schemeCategory10,
  extent,
  line,
  brushY,
  easeLinear,
  hcl,
  axisLeft,
  axisRight,
  axisBottom,
} from 'd3';
import { memoize } from './memoize';

// Shifts the hue of a given color.
const hueShift = (hueDelta) => (color) => {
  const newColor = hcl(color);
  newColor.h += hueDelta;
  return newColor.hex();
};

const lineGenerator = line();

// TOOLTIP
const tooltip = select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('position', 'absolute')
  .style('visibility', 'hidden')
  .style('padding', '10px')
  .style('background', 'rgba(255, 255, 255, 0.9)')
  .style('border', '1px solid #ccc')
  .style('border-radius', '5px')
  .style('pointer-events', 'none')
  .style('font-size', '14px');

export const parallelCoordinates = (
  selection,
  {
    data,
    columns,
    columnTypes,
    colorValue,
    idValue,
    width,
    height,
    brushWidth = 50,
    brushedIntervals,
    updateBrushedInterval,
    marginTop = 30,
    marginRight = 94,
    marginBottom = 50,
    marginLeft = 63,
  },
) => {
  const xScale = scalePoint()
    .domain(columns)
    .range([marginLeft, width - marginRight]);

  const yScales = {};
  for (const column of columns) {
    yScales[column] =
      columnTypes[column] === 'quantitative'
        ? scaleLinear()
            .domain(extent(data, (d) => d[column]))
            .range([height - marginBottom, marginTop])
        : scalePoint()
            .domain(data.map((d) => d[column]))
            .range([height - marginBottom, marginTop]);
  }

  const colorScale = scaleOrdinal()
    .domain(data.map(colorValue))
    .range(schemeCategory10.map(hueShift(-74)));

  const filteredData = memoize(
    () => {
      return data.filter((d) => {
        for (const column of columns) {
          const interval = brushedIntervals[column];
          if (interval) {
            const yPixelValue = yScales[column](d[column]);
            const [yPixelMin, yPixelMax] = interval;
            if (
              yPixelValue > yPixelMax ||
              yPixelValue < yPixelMin
            ) {
              return false;
            }
          }
        }
        return true;
      });
    },
    [data, columns, brushedIntervals],
    selection.node(),
  );

  const normalStrokeWidth = 2;
  const highlightedStrokeWidth = 5;

  const g = selection
    .selectAll('g.marks')
    .data([null])
    .join('g')
    .attr('class', 'marks');

  // Render the multi-line paths with fade transitions!
  const t = transition().duration(500).ease(easeLinear);
  g.selectAll('path.mark')
    .data(filteredData, idValue)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('class', 'mark')
          .attr('opacity', 0)
          .call((enter) =>
            enter.transition(t).attr('opacity', 1),
          ),
      (update) =>
        update.call((update) =>
          update.transition(t).attr('opacity', 1),
        ),
      (exit) =>
        exit.call((exit) =>
          exit.transition(t).attr('opacity', 0).remove(),
        ),
    )
    .attr('fill', 'none')
    .attr('stroke', (d) => colorScale(colorValue(d)))
    .attr('stroke-width', 16 / 10)
    .style('pointer-events', 'none')
    .style('mix-blend-mode', 'screen')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('d', (d) =>
      lineGenerator(
        columns.map((column) => [
          xScale(column),
          yScales[column](d[column]),
        ]),
      ),
    );

  const paths = g
    .selectAll('path.mark')
    .data(filteredData, idValue)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('class', 'mark')
          .attr('stroke-width', normalStrokeWidth)
          .attr('d', (d) =>
            lineGenerator(
              columns.map((column) => [
                xScale(column),
                yScales[column](d[column]),
              ]),
            ),
          ),
      (update) => update,
      (exit) => exit.remove(),
    );

  selection
    .selectAll('g.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr(
      'transform',
      `translate(0,${height - marginBottom})`,
    )
    .style('color', '#FFFFFF')
    .style('font-size', 18)
    .call(
      axisBottom(xScale)
        .tickFormat((str) => str.replace('_', ' '))
        .tickPadding(11),
    )
    .call((selection) => {
      selection.selectAll('line').remove();
      selection.selectAll('path').remove();
    });

  columns.forEach((column, i) => {
    selection
      .selectAll(`g.y-axis-${i}`)
      .data([null])
      .join('g')
      .attr('class', `y-axis-${i}`)
      .attr('transform', `translate(${xScale(column)}, 0)`)
      .call(
        (i === columns.length - 1 ? axisRight : axisLeft)(
          yScales[column],
        )
          .tickPadding(8)
          .tickSize(0)
          .ticks(6),
      )
      .call((selection) => {
        selection
          .selectAll('text')
          .attr('fill', '#FFFFFF')
          .attr('font-size', 14)
          .attr('paint-order', 'stroke')
          .attr('stroke-width', 50 / 10)
          .attr('stroke-linejoin', 'round')
          .attr('stroke', '#000000')
          .attr('stroke-opacity', 80 / 100);

        selection
          .selectAll('line')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 40 / 10);

        // Remove the domain paths
        selection.select('.domain').remove();
      });
  });

  g.selectAll('path.mark')
    .data(filteredData, idValue)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('class', 'mark')
          .attr('opacity', 0)
          .call((enter) =>
            enter.transition(t).attr('opacity', 1),
          ),
      (update) =>
        update.call((update) =>
          update.transition(t).attr('opacity', 1),
        ),
      (exit) =>
        exit.call((exit) =>
          exit.transition(t).attr('opacity', 0).remove(),
        ),
    )
    .attr('fill', 'none')
    .attr('stroke', (d) => colorScale(colorValue(d)))
    .attr('stroke-width', 16 / 10)
    .style('pointer-events', 'auto')
    .attr('d', (d) =>
      lineGenerator(
        columns.map((column) => [
          xScale(column),
          yScales[column](d[column]),
        ]),
      ),
    )

    .on('mouseover', function (event, d) {
      select(this)
        .raise()
        .transition()
        .attr('stroke-width', highlightedStrokeWidth);
      tooltip
        .style('visibility', 'visible')
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY + 10 + 'px').html(`
      <strong>Player:</strong> ${d.short_name}<br>
      <strong>Team:</strong> ${d.club_name}<br>
    `); // Update this line to include the data you want to show
    })
    .on('mousemove', (event) => {
      tooltip
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY + 10 + 'px');
    })
    .on('mouseout', function () {
      select(this)
        .transition()
        .attr('stroke-width', normalStrokeWidth); // Reset the stroke width

      tooltip.style('visibility', 'hidden');
    });

  // Add the brushes.
  const brush = brushY()
    .extent([
      [-(brushWidth / 2), marginTop],
      [brushWidth / 2, height - marginBottom],
    ])
    .on(
      'start brush end',
      ({ selection, sourceEvent }, column) => {
        if (sourceEvent) {
          updateBrushedInterval({
            column,
            interval: selection,
          });
        }
      },
    );
  selection
    .selectAll('g.brush')
    .data(columns)
    .join('g')
    .attr('class', 'brush')
    .attr(
      'transform',
      (column) => `translate(${xScale(column)}, 0)`,
    )
    .call(brush)
    .each(function (column) {
      if (brushedIntervals[column]) {
        select(this).call(
          brush.move,
          brushedIntervals[column],
        );
      }
    });
};
