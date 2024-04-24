import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import {
  csv,
  scaleLinear,
  scaleBand,
  scaleOrdinal,
  line,
  max,
  timeFormat,
  extent,
  histogram as bin,
  timeMonths,
  sum,
  pie,
  arc,
} from 'd3';
import ReactDropdown from 'react-dropdown';
import { ColorLegend } from './ColorLegend';
import { useData } from './useData';
import { AxisBottom } from './AxisBottom';
import { Marks } from './Marks';
import { MarksLine } from './MarksLine';

const width = 960;
const menuHeight = 80;
const height = 500 - menuHeight;
const margin = {
  top: 40,
  right: 100,
  bottom: 40,
  left: 90,
};
const xAxisLabelOffset = 65;
const yAxisLabelOffset = 30;

const club_name = [
  'Arsenal',
  'Aston Villa',
  'Bournemouth',
  'Brentford',
  'Brighton & Hove Albion',
  'Burnley',
  'Chelsea',
  'Crystal Palace',
  'Everton',
  'Fulham',
  'Liverpool',
  'Luton Town',
  'Manchester City',
  'Manchester United',
  'Newcastle United',
  'Nottingham Forest',
  'Sheffield United',
  'Tottenham Hotspur',
  'West Ham United',
  'Wolverhampton Wanderers',
];

const Xattributes = [];

for (let j = 0; j < club_name.length; j++) {
  const attr = { value: club_name[j], label: club_name[j] };
  Xattributes.push(attr);
}

const getLabel = (value) => {
  for (let i = 0; i < Xattributes.length; i++) {
    if (Xattributes[i].value === value) {
      return Xattributes[i].label;
    }
  }
};

//const Yattributes=[];

const App = () => {
  const data = useData();

  const initialXAttribute = 'Manchester United';
  const [xAttribute, setXAttribute] = useState(
    initialXAttribute,
  );
  const initialYAttribute = 'M. Rashford';
  const [yAttribute, setYAttribute] = useState(
    initialYAttribute,
  );
  //const xValue = d => d[xAttribute];
  //const xAxisLabel = getLabel(xAttribute);

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const data1 = data.filter(function (d) {
    return d.club_name == xAttribute;
  });

  const firstPLY = data1[0].short_name;
  console.log(firstPLY);

  const Yattributes = [];
  for (let j = 0; j < data1.length; j++) {
    const attr = {
      value: data1[j].short_name,
      label: data1[j].short_name,
    };
    Yattributes.push(attr);
  }
  const dataPLY = data1.filter(function (d) {
    return d.short_name == yAttribute;
  });

  console.log(Yattributes);
  console.log(dataPLY);

  const xValue = (d) => d.player_name;
  const xAxisLabel = 'Player';

  const yValue = (d) => d.GP;
  const yAxisLabel = 'Game Played';

  const rebValue = (d) => d.pace;
  const rebAxisLabel = 'Pace';
  const astValue = (d) => d.shooting;
  const astAxisLabel = 'Shooting';
  const stlValue = (d) => d.passing;
  const stlAxisLabel = 'Passing';
  const blkValue = (d) => d.dribbling;
  const blkAxisLabel = 'Dribbling';
  const ptsValue = (d) => d.defending;
  const ptsAxisLabel = 'Defending';
  const tovValue = (d) => d.physic;
  const tovAxisLabel = 'Physic';

  const colorLegendLabel = 'Color Index';
  const colorScale = scaleOrdinal()
    .domain(['Wins', 'Loses'])
    .range(['lightgreen', 'lightcoral']);

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const radiusRange = (5 / 9) * innerHeight;

  const ptsScale = scaleLinear()
    .domain([0, max(data1, (d) => d.defending)])
    .range([0, radiusRange]);
  const rebScale = scaleLinear()
    .domain([0, max(data1, (d) => d.pace)])
    .range([0, radiusRange]);
  const astScale = scaleLinear()
    .domain([0, max(data1, (d) => d.shooting)])
    .range([0, radiusRange]);
  const stlScale = scaleLinear()
    .domain([0, max(data1, (d) => d.passing)])
    .range([0, radiusRange]);
  const blkScale = scaleLinear()
    .domain([0, max(data1, (d) => d.dribbling)])
    .range([0, radiusRange]);
  const tovScale = scaleLinear()
    .domain([0, max(data1, (d) => d.physic)])
    .range([0, radiusRange]);

  const ptsxPos = (d) =>
    innerWidth / 2 +
    ptsScale(ptsValue(d)) * Math.cos((0 * Math.PI) / 3);
  const ptsyPos = (d) =>
    (height - margin.top) / 2 +
    ptsScale(ptsValue(d)) * Math.sin((0 * Math.PI) / 3);
  const rebxPos = (d) =>
    innerWidth / 2 +
    rebScale(rebValue(d)) * Math.cos((1 * Math.PI) / 3);
  const rebyPos = (d) =>
    (height - margin.top) / 2 +
    rebScale(rebValue(d)) * Math.sin((1 * Math.PI) / 3);
  const astxPos = (d) =>
    innerWidth / 2 +
    astScale(astValue(d)) * Math.cos((2 * Math.PI) / 3);
  const astyPos = (d) =>
    (height - margin.top) / 2 +
    astScale(astValue(d)) * Math.sin((2 * Math.PI) / 3);
  const stlxPos = (d) =>
    innerWidth / 2 +
    stlScale(stlValue(d)) * Math.cos((3 * Math.PI) / 3);
  const stlyPos = (d) =>
    (height - margin.top) / 2 +
    stlScale(stlValue(d)) * Math.sin((3 * Math.PI) / 3);
  const blkxPos = (d) =>
    innerWidth / 2 +
    blkScale(blkValue(d)) * Math.cos((4 * Math.PI) / 3);
  const blkyPos = (d) =>
    (height - margin.top) / 2 +
    blkScale(blkValue(d)) * Math.sin((4 * Math.PI) / 3);
  const tovxPos = (d) =>
    innerWidth / 2 +
    tovScale(tovValue(d)) * Math.cos((5 * Math.PI) / 3);
  const tovyPos = (d) =>
    (height - margin.top) / 2 +
    tovScale(tovValue(d)) * Math.sin((5 * Math.PI) / 3);

  const marks = [];

  const pstPos = dataPLY.map((d) => ({
    x: ptsxPos(d),
    y: ptsyPos(d),
  }));

  const rebPos = dataPLY.map((d) => ({
    x: rebxPos(d),
    y: rebyPos(d),
  }));

  const astPos = dataPLY.map((d) => ({
    x: astxPos(d),
    y: astyPos(d),
  }));

  const stlPos = dataPLY.map((d) => ({
    x: stlxPos(d),
    y: stlyPos(d),
  }));

  const blkPos = dataPLY.map((d) => ({
    x: blkxPos(d),
    y: blkyPos(d),
  }));

  const tovPos = dataPLY.map((d) => ({
    x: tovxPos(d),
    y: tovyPos(d),
  }));

  console.log(dataPLY.length);
  if (dataPLY.length == 0) {
    marks.push({ x: 0, y: 0 });
  } else {
    marks.push(pstPos[0]);
    marks.push(rebPos[0]);
    marks.push(astPos[0]);
    marks.push(stlPos[0]);
    marks.push(blkPos[0]);
    marks.push(tovPos[0]);
    marks.push(pstPos[0]);
  }

  console.log(marks);

  const path = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);
  console.log(path(marks));

  const labelOffset = 10; // Adjust based on your needs for label positioning

  return (
    <>
      <div className="menus-container">
        <span className="dropdown-label">Team:</span>
        <ReactDropdown
          options={Xattributes}
          value={xAttribute}
          onChange={({ value }) => {
            const newTeam = value;
            setXAttribute(newTeam);

            // Filter the data for the new team
            const newTeamData = data.filter(
              (d) => d.club_name === newTeam,
            );

            // Set the first player of the new team as the default, if available
            if (newTeamData.length > 0) {
              const firstPlayer = newTeamData[0].short_name;
              setYAttribute(firstPlayer);
            } else {
              // Handle the case where the team has no players
              setYAttribute('No players available');
            }
          }}
        />
        <span className="dropdown-label">Player:</span>
        <ReactDropdown
          options={Yattributes}
          value={yAttribute}
          onChange={({ value }) => setYAttribute(value)}
        />
      </div>
      <svg width={width} height={height}>
        <g
          transform={`translate(${margin.left},${margin.top})`}
        >
          <AxisBottom
            xScale={ptsScale}
            x={innerWidth / 2}
            y={innerHeight}
            leftMargin={margin.left}
            maxRadius={radiusRange}
            tickOffset={25}
            angle={Math.PI * 0}
          />
          <AxisBottom
            xScale={rebScale}
            x={innerWidth / 2}
            y={innerHeight}
            leftMargin={margin.left}
            maxRadius={radiusRange}
            tickOffset={25}
            angle={Math.PI / 3}
          />
          <AxisBottom
            xScale={astScale}
            x={innerWidth / 2}
            y={innerHeight}
            leftMargin={margin.left}
            maxRadius={radiusRange}
            tickOffset={25}
            angle={(2 * Math.PI) / 3}
          />
          <AxisBottom
            xScale={stlScale}
            x={innerWidth / 2}
            y={innerHeight}
            leftMargin={margin.left}
            maxRadius={radiusRange}
            tickOffset={25}
            angle={Math.PI}
          />
          <AxisBottom
            xScale={blkScale}
            x={innerWidth / 2}
            y={innerHeight}
            leftMargin={margin.left}
            maxRadius={radiusRange}
            tickOffset={25}
            angle={(4 * Math.PI) / 3}
          />
          <AxisBottom
            xScale={tovScale}
            x={innerWidth / 2}
            y={innerHeight}
            leftMargin={margin.left}
            maxRadius={radiusRange}
            tickOffset={25}
            angle={(5 * Math.PI) / 3}
          />
          <path
            d={path(marks)}
            stroke={'PaleVioletRed'}
            fill={'Pink'}
            opacity="0.7"
            strokeWidth="3"
          />

          <line
            x1={
              innerWidth / 2 +
              radiusRange * Math.cos(Math.PI)
            }
            y1={
              (height - margin.top) / 2 +
              radiusRange * Math.sin(Math.PI)
            }
            x2={
              innerWidth / 2 +
              radiusRange * Math.cos(0 * Math.PI)
            }
            y2={
              (height - margin.top) / 2 +
              radiusRange * Math.sin(0 * Math.PI)
            }
            stroke="black"
          />

          <line
            x1={
              innerWidth / 2 +
              radiusRange * Math.cos(Math.PI / 3)
            }
            y1={
              (height - margin.top) / 2 +
              radiusRange * Math.sin(Math.PI / 3)
            }
            x2={
              innerWidth / 2 +
              radiusRange * Math.cos((4 * Math.PI) / 3)
            }
            y2={
              (height - margin.top) / 2 +
              radiusRange * Math.sin((4 * Math.PI) / 3)
            }
            stroke="black"
          />

          <line
            x1={
              innerWidth / 2 +
              radiusRange * Math.cos((2 * Math.PI) / 3)
            }
            y1={
              (height - margin.top) / 2 +
              radiusRange * Math.sin((2 * Math.PI) / 3)
            }
            x2={
              innerWidth / 2 +
              radiusRange * Math.cos((5 * Math.PI) / 3)
            }
            y2={
              (height - margin.top) / 2 +
              radiusRange * Math.sin((5 * Math.PI) / 3)
            }
            stroke="black"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(1 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(2 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(3 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(4 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(5 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(6 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(7 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <circle
            cx={innerWidth / 2}
            cy={(height - margin.top) / 2}
            r={(8 / 8) * radiusRange}
            fill="none"
            stroke="#A9A9A9"
          />

          <path
            d={path(marks)}
            stroke={'PaleVioletRed'}
            fill={'Pink'}
            opacity="0.7"
            stroke-width="3"
          />

          <Marks
            data={dataPLY}
            ptsScale={ptsScale}
            ptsValue={ptsValue}
            rebScale={rebScale}
            rebValue={rebValue}
            astScale={astScale}
            astValue={astValue}
            stlScale={stlScale}
            stlValue={stlValue}
            blkScale={blkScale}
            blkValue={blkValue}
            tovScale={tovScale}
            tovValue={tovValue}
            innerWidth={innerWidth}
            height={height - margin.top}
            line={path}
            fillColor={'Pink'}
            lineColor={'PaleVioletRed'}
          />
          <text
            x={ptsxPos(dataPLY[0]) + 25}
            y={ptsyPos(dataPLY[0]) - 10}
            textAnchor="middle"
            fontWeight="bold"
          >
            DEF
          </text>
          <text
            x={rebxPos(dataPLY[0]) + 25}
            y={rebyPos(dataPLY[0]) - 10}
            textAnchor="middle"
            fontWeight="bold"
          >
            PAC
          </text>
          <text
            x={astxPos(dataPLY[0])}
            y={astyPos(dataPLY[0]) + 20}
            textAnchor="middle"
            fontWeight="bold"
          >
            SHO
          </text>
          <text
            x={stlxPos(dataPLY[0]) - 25}
            y={stlyPos(dataPLY[0]) + 15}
            textAnchor="middle"
            fontWeight="bold"
          >
            PAS
          </text>
          <text
            x={blkxPos(dataPLY[0]) - 25}
            y={blkyPos(dataPLY[0]) + 15}
            textAnchor="middle"
            fontWeight="bold"
          >
            DRI
          </text>
          <text
            x={tovxPos(dataPLY[0])}
            y={tovyPos(dataPLY[0]) - 10}
            textAnchor="middle"
            fontWeight="bold"
          >
            PHY
          </text>
        </g>
      </svg>
    </>
  );
};
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
