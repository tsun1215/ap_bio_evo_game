# AP Biology: Evolutionary Fitness Game #
## Contents ##
* [Summary] (#summary "Game summary")
* [Controls] (#controls "Game controls")

## Summary ##
Our game creates a small world, which consists of a grid of thousands of tiles. Each tile has three main traits—temperature, water, and nutrient availability—as well as various minor traits. The three main traits of each tile determine the domain type of the tile, characterizing it into one of four types: desert/beach, water, grassland, and snow. From there, the color of each tile is based on the type of tile it is and the extremity of the main traits of the tile, making deeper ocean tiles a darker blue than more shallow oceans. 

In this world live various populations, shown as small circles. Each population has two main attributes—heat preference, and humidity preference. These two attributes are combined with its current location’s temperature, water, and nutrient availability to calculate the location’s carrying capacity for the species of the population. This resulting carrying capacity, the current population, and the suitability of the environment (based on the heat preference and humidity preference of the population) are used in a logistical function to calculate the change in population every 1.5 seconds. Visible immediately next to each circle is the number of individuals in each population. Upon clicking on a population, the population, the percentage of the population that prefers hot environments, and the percentage of the population that prefers humid environments, are visible. 

Over time, each population evolves, becoming more adapted to the environment it is in. For example, in hot environments, one can see that the percentage of the population that prefers heat increases gradually as the heat-favoring individuals in the population prosper while the ones who don’t slowly decrease in number; thus, heat-favoring individuals begin to comprise a larger percentage of the total population. Populations that can’t adapt fast enough or that migrate into unfavorable tiles may die. 

Speciation occurs when the percentage of the population that prefers a certain trait changes drastically, and new species are given a new species number. One can see allopatric speciation occur when one moves part of a population to a new environment, where—if it doesn’t die off—the population could change enough to turn into a new species because its new habitat is far enough and different enough from the habitat of the original population. 

Populations can be moved from a habitat (emigration) to another habitat (immigration). If a population moves into a location current occupied by another population, the two populations will merge if they are of the same species, or they will simply live in the same place as separate populations if they are of different species. 

Very uncommonly, natural disasters may occur. Natural disasters and habitat changes affect the main traits of the entire map drastically—ice ages decrease the temperature, while global warming increases the temperature, and floods raise the water level, while droughts lower them. As a result of drastic environment changes due to natural disasters and habitat change, species that are not adapt may die off, causing mass extinctions. 

## Controls ##
* Left click (Population): Select population to see info 
* Double left click (Population): Select population to move 
 * Scroll (After population selection): Select population size to move 
 * Left click (After population size selection): Move population 
* Left click (Map), drag: Move map 
* Scroll (Map): Zoom in/out