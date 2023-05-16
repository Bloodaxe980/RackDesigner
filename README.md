# RackDesigner
# Modular Synth Rack Designer

   All Glory, Honor, and Praise to God the Father, God the Son and God the Holy Spirt.

An app for designing a modular synthisizer rack.  Use it to visualize the angles for your case and gauge the volume of 
space the case will consume.

*****************************

This designer is based off the original project by:

Ryan Todd-Nakamura a.k.a. intafon
(https://intafon.github.io/diyEurorackCasePlanner/planner.html).

His app is loosely based on the [Future Music guide for how to build your own cardboard eurorack modular case]
(http://www.musicradar.com/tuition/tech/how-to-build-your-own-cardboard-eurorack-modular-case-625196) and the accompanying 
PDF [CardboardCaseGuide](http://cdn.mos.musicradar.com/images/aaaroot/tech/7july15/DIY-Eurorack-case/CardboardCaseGuide.zip). 

*****************************

Currently the designer shows the measurements for the side view of the case. Dotted lines show the outlines of the material 
used on the bottom of the case as well as the front and back of the case to show overlap -- by default this material thickness 
is based on the Future Music guide's 5mm cardboard thickness.  Material thickness can be changed.

## Parameters

***************************** 
NOTE: There are many items which are currently not functional i.e. convert from metric to inch, background theme, 3D
*****************************

There are several adjustable parameters in the designer. 

The module depth max signifies the deepest module you wish to support in the case, which is set by default to 55mm. Note the 
"calculate needed rise" toggle -- if selected, this calculates the necessary rise at the front of the case to accomodate the 
module depth. If there is an angle greater than zero for the first row of modules, the full module depth may not be needed. 
(if your first angle is 30 degrees, 47.6mm is sufficient for 55mm clearance)

Row angles are compounding i.e. if we set row-1 at 10 degrees from 0, and row-2 at 20 degrees of rotation from row-1 we get a 
total of a 30 degree angle from 0 for row-2.  Row-3 builds off of row-2 so the starting angle in this example is 30 degrees.  
If we set row-3 to 30 degrees this is added to the previous for a total of a 60 degree angle from 0.

Material thickness is set by default to 5mm -- this indicates the thickness of the material used for the case.

Pixel depth  -- allows the user to change the size of the case design on the screen. It can be used to accomodate changes in 
window size.

*****************************
TO DO:

1a.  Priority-High: Draw 1 unit lenghths **DONE**

1b.  Priority-High: Set the Intelijel vs. Plumb audio standard for 1 unit lenght.

2.  Priority-High:  Hold back of case to correct position in drawing when angle exceeds 90 degrees.

3.  Priority-High:  Imperial (inches) vs Metric

4.  Priority-High:  Front panel vert or prow

5.  Priority-Med:  Scale drawing

6.  Priority-Low:  Themes, page text and background, cookies

7.  Priority-Low:  3D views 

8.  Priority-Low:  Function to fill 3D view HP with random gen modules

9.  Priority-Low:  Function to import module image to use in case.  Modules will requires inputs of name, HP# and U-height.  Creates a local img file

10.  Priority-Low:  Function to snap into place imported modules

11.  Priority-Low:  Function to save designs locally.

12.  Priority-Medium:  Function to print drawing and info.

13.  Priority-Just a thought:  Incorporate material list and prices.  i.e. lumber, screws, glue, rails, inserts, nuts, etc. 
 
