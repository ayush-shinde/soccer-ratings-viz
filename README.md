# Data Visualization Project

## Data

The primary data source for this project will be player ratings from the EAFC24 database, which provides comprehensive ratings for soccer players. Additional statistics will be collected to complement these ratings and provide a broader understanding of each player's performance.

Dataset source: https://www.kaggle.com/datasets/stefanoleone992/ea-sports-fc-24-complete-player-dataset

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

* Data acquisition and cleaning from the EAFC24 database to ensure usability in the visualization.
* Creation of an interactive spider chart to visualize individual player ratings across multiple metrics.
* Development of parallel coordinate plots to compare multiple players across different performance metrics.
* Design of a customizable scatter plot to compare players on any two selected performance metrics.

## Sketches

The final project will feature an interactive full-screen visualization with the following components:

Interactive Spider Chart: Allows users to select a soccer player and view their ratings across various metrics in a spider chart format.
Parallel Coordinate Plot: Players will be represented as lines across different axes, each corresponding to a performance metric. Users can filter and customize the visualization by brushing over axes and rearranging or removing them.
Customizable Scatter Plot: Users will be able to select any two performance metrics to be displayed on the X and Y axes and compare a selected number of players on these metrics.

## Prototypes
![image](https://github.com/ayush-shinde/soccer-ratings-viz/assets/73592376/1c58eada-aae4-4d2f-94e4-104a7aaba426)

![image](https://github.com/ayush-shinde/soccer-ratings-viz/assets/73592376/fedae3b3-96f3-4159-9460-41ea933190e4)

Note: These images just depict the concept I attempt to replicate in my project. 

Sources:
https://vizhub.com/yichenlilyc/99b510120dcc4b4c8100a0005ee632a1
https://blocks.roadtolarissa.com/syntagmatic/raw/3150059/index.html

## Open Questions
<ul>
  <li>One is the integration of interactive features such as brushing in the parallel coordinate plot and dynamic updates in the scatter plot. I am currently uncertain about the best way to implement these features to ensure a smooth user experience.</li>
  <li>I am also considering the challenge of designing the interface to be intuitive so that users can easily customize their views without being overwhelmed by the complexity of multi-dimensional data.</li>
  <li>There is a level of uncertainty about the responsiveness of the visualization across different devices and screen sizes, ensuring accessibility for all users.</li>
</ul>

## Milestones
  <strong>Week 1: Initialization</strong>
<p>Set up GitHub repository. Gather initial data from EAFC24.</p>
<strong>Week 2: Data Preprocessing</strong>
<p>Clean and preprocess data for visualization. Sketch the initial spider chart design.</p>
<strong>Week 3: Spider Chart Development</strong>
<p>Implement basic interactivity for the spider chart.</p>
<strong>Week 4: Parallel Coordinates</strong>
<p>Develop a parallel coordinate plot with basic interactivity.</p>
<strong>Week 5: Scatter Plot Implementation</strong>
<p>Code basic customizable scatter plot.</p>
<strong>Week 6: Interactivity Enhancement</strong>
<p>Refine interactivity and user interface.
Final adjustments and complete documentation.</p>
