# CALIFORNIA PUBLIC SCHOOL DROPOUT

## Motivation

Every year, over 1.2 million students drop out of high school in the United States alone [1]. Therefore, it is important for the education officials to understand who is more likely to drop out, where students are more likely to drop out, and which grade students usually drop out. In our project, we focus on California and develop an interactive visualization to understand what are the key drivers of dropouts among public high school students in California. We are interested in answering the following questions:

1. Which counties in California have the most school dropouts? 
2. Who (gender, ethnicity, academic year) is more likely to drop out of high school in California? 
3. Are there more or fewer dropouts over the years in California? Is the trend related to the policies? 

## Data Transformation 

We download the data from the website of the California Department of Education [2]. We merge the data files by the student id and extract the most important columns we care about: school id, county, city, latitude, longitude, academic_year, gender, ethnicity, num_dropout. Besides, we also extract the major reform events per year from the “Timeline of California Standards-Based Reform” website [3] as additional data to inform what happens in California in a specific year. Please note that not all the years contain major reform events, for these years without any reform, we show “no major reform” in our visualization. 


## Layout Design

In our webpage, we introduce our topic along with the research question to inform the audience of our motivation. We layout the geospatial map and the line charts first, followed by the Sankey diagram and the event list to allow our audience to interact with the data and understand what is happening beneath the numbers. 


## Design Process 

The first step is to understand the general trend across counties. On the top left, we decide to use color to encode the number of dropout cases in the county-level geospatial map on the left side of our page, which helps users to immediately understand which counties have more dropout cases. On the top right, we show the distribution of dropouts in three bar charts. These bar charts are an important step for the users to explore the data. At last, we hope that the users can investigate our data in more detail and identify the flows of dropouts, or the dropout numbers consist of which groups of people. Therefore, we use a Sankey diagram to achieve this goal, where the users can choose any two factors and investigate their flow and their contribution to the overall dropout number. Along with the Sankey diagram, we also encode the major reforms in a year with a list item to help the users understand the trend and composition changes. On the bottom, we show accompanying line charts to help users see the number of dropouts over the years as well as the distribution of dropouts along certain dimensions (gender, ethnicity, academic_year). Eventually, these designs are capable of answering the 3 questions (trend, where, who) we propose in the beginning. 


### Interactive Design

With regard to interactive design, these are the main highlights of our visualization: 

1. Slider: the year slider allows users to choose a specific year to look at. All the plots (Geomap, Sankey map, list, chart/line charts)  will update dynamically after the slider moves. Alternatively, we think about using a dropdown menu for year selection, but the slider is a more natural choice for users to explore the data in temporal order. Also, there are more than 20 years, which will make the dropdown menu less user-friendly (too long).  There is also an “All Year” button that allows users to select all the years and update plots accordingly. 
2. Hover: 
    - Tooltip: when the mouse hovers over the county on the geospatial map, users can see a tooltip with the county name and the exact number of dropouts in that county. Therefore, they can easily see the detailed information about each county by interacting with the map. 
    - Highlight: In either the Sankey diagram or the line charts, when users hover over them,  the corresponding line in the line charts and the flow in the Sankey diagram will both be highlighted. This function dramatically improves the user experience to connect the visualizations from different plots together. 
3. Click: 
    - By clicking on a county, we update the three bar charts on the top right side to show the demographic information of the dropouts for that county. This function aims to help users explore the data county by county. 
    - Click “Download” button: users can click a download button to get our data. 
4. Dropdown menu: there are two dropdown menus, which allow users to pick two factors out of gender, ethnicity, academic_year (grade), and county. After two factors are chosen, the Sankey diagram will update accordingly to show the flow of numbers. This is a great tool for users to investigate how each of these factors contributes to the overall dropout number. Alternatively, we thought about using a pie chart to see the composition of groups, but the pie chart is unable to visualize how two factors interact.

## Development process. 
Overall, there are two parts that take the most time: creating each visualization component and the overall layout design. Each visualization component needs to work well with our data and has many details to consider. Iteration on each component takes the most time. Another part that takes much time is to organize our visualization in a neat manner. It took a while to get margin conventions and position transformations right. 

- Charles Wu creates the foundation for the map and also develops key components for our visualization plots including Sankey diagrams, line/bar charts. He also designs and organizes the overall website’s layout. He spent at least 40 hours on this project. 
- Hang Jiang is responsible for developing the visualization for the geospatial map, the reform events, and one of the bar charts. He also drafts most of the write-up. He spent at least 40 hours on this project. 


## Getting Started

Run the following command to start the server locally: 

```python
python3 -m http.server 
```

## Citations

\[1\]: https://www.dosomething.org/us/facts/11-facts-about-high-school-dropout-rates

\[2\]: https://www.cde.ca.gov/ds/sd/sd/filesdropouts.asp (dropout dataset) 

\[3\]: https://www.cde.ca.gov/nr/re/hd/yr96-10tl.asp (reform event dataset)


## License
MIT
