/*JavaScript*/
/*jslint node: true */

"use strict";

var canvas, canvasDiv, calcRiseCb, ctx, e,frontPanelCb, h,
    init, input, inputDepth, matThickness, measureCb, pxDepthInput,
    roundToPlace, setStandard, showInches, standardHtCb, w, xStart;

var i = 0;
var rowUnitsH = [3, 3, 1];
var actualPanelHeight = rowUnitsH[i] * 44.45;
var actualRailSeparation = actualPanelHeight - 10; //mm
var actualRailDepth = 14; //mm
var actualPanelDepth = 60; //mm
var backPanelLocation;
var bod = document.querySelector("body");
var caseMaterialThickness = 5;
var color1 = document.querySelector(".color1");
var color2 = document.querySelector(".color2");
var defaultAngle = 10;
var defaultUnit = 3;
var eID = "";
var hpBuchla = 108; //mm or 4.25 in
var hpBx = 16;  //mm or .63 in
var hpEuro = 5.08; //mm or .2 in
var hpSerge = 25.4; //mm or 1 in
var maxY = 150;
var pxDepth = 300 / maxY;
var panelHeight = actualPanelHeight * pxDepth;
var heightRatio = actualPanelHeight / panelHeight;
var hp = hpEuro;
var unitInt = 39.65; //mm
var oneUnit = 44.45; //mm
var oneUnitStandard = unitInt;
var output = document.getElementById("degsOut");
var panel1 = [];
var panel2 = [];
var panels = [];
var prowTrue = false;
var rowCounts = [1, 2, 3, 4, 5, 6, 7, 8];
var rowCount = rowCounts[2];
var rowAngles = [10, 20, 30];
var firstAngle = rowAngles[0];
var rowInputs = [];
var slider = document.getElementById("rotation");
var textColor;
var unitHeight = 3;
var unitPlp = 43.2;  //mm
var useStaticRise = false;

/*function addGobalEventListener(type, selector, callback) {
	var e = '';
	document.addEventListener(type, e => {
		if (e.target.matches(selector)) callback(e)
	})
};
*/

document.addEventListener("DOMContentLoaded", function () {
    init();
});

/*
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = slider.value;
    setGradient();
};
*/

/*Show or Hide a HTML element*/
function showHide(eID) {
	var element = document.getElementById(eID);
	element.classList.toggle("hide");
}

function lookCb() {
    showHide("look");
}

function themeCb() {
    var bod = document.getElementById("body");
	bod.classList.toggle("white");
}

/*
function formatCb() {

// depricated:  there are now four different formats requireing a
different selection method. i.e. caseOf

	var checked = document.getElementById("format");
	checked ? hp=25.4 : hp = 5.08; //mm
}
*/


// Set height for front panel

var frontHeight = useStaticRise
    ? actualPanelDepth
    : Math.abs(actualPanelDepth * Math.sin(Math.PI / 2 - rad(firstAngle)));

// Horizontal starting position on the canvas
function startX() {
    return 50;
	/*var sx;
	if (prowTrue) {
		var firstAngle = rowAngles[0];
		var secondAngle = 90 - firstAngle;
		sx = trig90(frontHeight, firstAngle)
	}
	else sx = 50;
	return sx;*/
}

function trig90(leg, angleOpp) {
	//var leg;
	//var angleOpp;
	var missing = leg * Math.tan(angleOpp);
	return missing;
}

function startY() {
    return canvas.height - 50;
}

/**
 * Calculate radians from degrees.
 *
 * @param {number} d Degrees input.
 * @returns Radians value.
 */
function rad(d) {
    return (d / 180) * Math.PI;
}

/**
 * Shows a display of distance in text.
 *
 * @param {number} d Distance to show.
 * @param {boolean} showInches Whether or not to show inches translation.
 * @returns A display string.
 */
function actualDistance(d, showInches) {
    var t = Math.abs(roundToPlace(d, 1)) + "mm";
    if (showInches) {
        t += " (" + Math.abs(roundToPlace(d / 25.4, 1)) + "in)";
    }
    return t;
}

/**
 * The row angle inputs are based on the angle prior to the current angle. For
 * example, if the first row has an angle of 10 and the second also has an angle
 * of 15, the second row's actual angle is 25.
 *
 * @param {number} r The index number of the row for which to show the angle.
 * @returns The actual angle of the row.
 */
function getActualRowAngle(r) {
	var sum;
    if (r === undefined) {
        r = rowAngles.length;
	}
    return rowAngles.reduce((sum, cur, i) => {
        if (i <= r) { sum += cur;}
        return sum;
	}, 0);
}

/**
 * Draws the side silhouette of the case.
 */
function drawSide() {
    var firstAngle = rowAngles[0];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeStyle = "#999999";
    ctx.setLineDash([]); //([1, 5]);

	var backPanelLocation = 0;
    var maxX = 0,
        maxY = 0;
    var x, y;
    var p = [];

    function add(xn, yn, noWriteMarker) {
        x = xn;
        y = yn;
		var aa = getActualRowAngle();
		for (var i = 0; i < panels.length; i++){
			var aa = getActualRowAngle(i);
		}

        maxX = Math.max(maxX, xn);
            if ((maxX > backPanelLocation) && (aa < 91)){
                backPanelLocation = maxX;
			    };
		console.info("Back panel loc:", backPanelLocation, " aa: ", aa);
        maxY = Math.max(maxY, yn);
        p.push(xn, yn);
        if (noWriteMarker) {
            p.push(noWriteMarker);
        }
    }

    panels = rowAngles.map((r, i) => {
	    return {
            angle: getActualRowAngle(i),
            coords: [],
        };
    });
    console.info("panels", panels, "rowAngles", rowAngles);

	// Set the starting point of the drawing

    var frontPieceOutline = [];
    var backPieceOutline = [];

    add(xStart, 0);	//0, 0

    // bottom panel goes underneath the sides, front, and back

    var frontHeight = useStaticRise
        ? actualPanelDepth
        : Math.abs(actualPanelDepth * Math.sin(Math.PI / 2 - rad(firstAngle)));
    add(x, y + frontHeight);
	console.info("y+fht: ", y+frontHeight);

    // Add the points for drawing the dotted line representing the cardboard
    // piece for the case front on the inside of the front panel.
    frontPieceOutline.push(
        x + Math.cos(rad(firstAngle)) * caseMaterialThickness,
        y + Math.sin(rad(firstAngle)) * caseMaterialThickness
    );
    frontPieceOutline.push(x + Math.cos(rad(firstAngle)) * caseMaterialThickness, 0);
    frontPieceOutline.push(xStart, 0); // 0, 0
    add(
        x + Math.cos(rad(firstAngle)) * caseMaterialThickness,
        y + Math.sin(rad(firstAngle)) * caseMaterialThickness,
        "nowrite"
    );

    rowAngles.forEach((angle, i) => {
        panels[i].coords.push(x, y);
		actualPanelHeight = rowUnitsH[i] * 44.45;
        add(
            x + Math.cos(rad(getActualRowAngle(i))) * actualPanelHeight,
            y + Math.sin(rad(getActualRowAngle(i))) * actualPanelHeight,
            // If it is the last row, then the outline will continue for the
			//width of the material, so we'll just write the coord marker at
			// the end of that instead of the end of the row outline.
            i === rowAngles.length - 1
        );
        panels[i].coords.push(x, y);
    });

    // Add the points for drawing the dotted line representing the cardboard
    // piece for the case back on the inside of the back panel.
    backPieceOutline.push(x, y);
    // Now get the *inside* x position of the back of the case. We will add the
	//material thickness to this below.
    const backWallInside = x + Math.sin(rad(getActualRowAngle())) * actualPanelDepth;
    backPieceOutline.push(
        backWallInside,
        y - Math.cos(rad(getActualRowAngle())) * actualPanelDepth
    );
    backPieceOutline.push(backWallInside, 0);

    add(
        x + Math.cos(rad(getActualRowAngle())) * caseMaterialThickness,
        y + Math.sin(rad(getActualRowAngle())) * caseMaterialThickness
    );

    add(
        backWallInside + caseMaterialThickness,
        y - Math.cos(rad(getActualRowAngle())) * actualPanelDepth
    );
    add(x, 0);
    add(0, 0);

    ctx.setLineDash([1, 5]);
    ctx.beginPath();
    // Draw the base board outline
    drawPath(
        false,
        0, // X
        0, // Y
        backPanelLocation,  // X
        0,  // Y
        backPanelLocation,  // X
        +caseMaterialThickness,  // Y
        0,  // X
        +caseMaterialThickness,  // Y
        0,  // X
        0  // Y
    );
    ctx.closePath();

    // draw the front and back side outlines
    frontPieceOutline.unshift("false");
    backPieceOutline.unshift("false");
    ctx.beginPath();
    drawPath(frontPieceOutline);
    ctx.closePath();
    ctx.beginPath();
    drawPath(backPieceOutline);
    ctx.closePath();

    ctx.setLineDash([]);
    const railScrewCoords = drawPanelRails(panels);
    const pathCoords = p.slice(0);
    drawPath(p);

    writeSummary(maxX, maxY, backPanelLocation, pathCoords, railScrewCoords);
}

/**
 * Writes out the summary data for the case.
 *
 * @param {number} width
 * @param {number} height
 * @param {number} depth
 * @param {array} outlinePoints
 * @param {array} railScrewCoords
 */
function writeSummary(width, height, back, outlinePoints, railScrewCoords) {
    var cabinetInfo = [
        "Cabinet depth and height: ",
        actualDistance(width, true) + " x " + actualDistance(height, true),
    ];
    var panelHeightInfo = [
        "3U panel height: ",
        actualDistance(actualPanelHeight, true),
    ];
    var panelDepthInfo = ["Panel depth used: ", actualDistance(actualPanelDepth, true)];
    var backPanelInfo = ["Max depth of back panel: ", back];
    var railDepthInfo = ["Rails depth inset: ", actualDistance(actualRailDepth, true)];
    var railSpacingInfo = [
        "Rail screw spacing*: ",
        actualDistance(actualRailSeparation, true),
    ];
    let totalRowtation = [`Top row absolute rotation: `, `${getActualRowAngle()}`];
    var footnote = [
        "*Note: rail spacing based on the measurements provided by " +
            '<a target="_blank" href="http://www.musicradar.com/tuition/tech/how-to-build-your-own-cardboard-' +
            "eurorack-modular-case-625196\">Future Music's cardboard DIY case</a> " +
            "using TipTop Audio Z-Rails.",
        "",
    ];
    var info = [
        cabinetInfo,
        panelHeightInfo,
        //oneUHeightInfo,
        panelDepthInfo,
        backPanelInfo,
        railDepthInfo,
        railSpacingInfo,
        totalRowtation,
        footnote,
    ];
    // console.info(info.map(function(a) {
    //     return a.join("\t");
    // }).join("\n"));
    document.getElementById("summary-div").innerHTML = info
        .map(function (a) {
            return a[0] + "<b>" + a[1] + "</b>";
        })
        .join("<br/>");

    function processCoords(outlinePoints) {
        const ops = outlinePoints.slice(0);
        const s = [];
        while (ops.length > 0) {
            const x = `${roundToPlace(ops.shift(), 1)}mm`;
            const y = `${roundToPlace(ops.shift(), 1)}mm`;
            if (typeof ops[0] !== "number") {
                ops.shift();
            } else {
                s.push(`(${x}, ${y})`);
            }
        }
        return s.join(", ");
    }

    function processRailScrewCoords(railScrewCoords) {
        const rsc = railScrewCoords.slice(0);
        const s = [];
        while (rsc.length > 0) {
            s.push(
                `(${roundToPlace(rsc.shift(), 1)}mm, ${roundToPlace(rsc.shift(), 1)}mm)`
            );
        }
        return s.join(", ");
    }

    const info2 = [
        ["Coordinates for outline: ", processCoords(outlinePoints)],
        ["Coordinates for rail screws: ", processRailScrewCoords(railScrewCoords)],
    ];
    document.getElementById("summary-div-2").innerHTML = info2
        .map(function (a) {
            return a[0] + "<b>" + a[1] + "</b>";
        })
        .join("<br/>");
}

/**
 * Calculates the coordinates used for drawing the graphics.
 *
 * @param {number} x
 * @param {number} y
 * @returns x and y coordinates to be used for drawing.
 */
function getPlot(x, y) {
    return {
        x: startX() + x / heightRatio,
        y: startY() - y / heightRatio,
    };
}

/**
 * Convenience overload of the canvas context moveTo function using the getPlot
 * function above for drawing.
 *
 * @param {number} x
 * @param {number} y
 */
function moveTo(x, y) {
    var plot = getPlot(x, y);
    ctx.moveTo(plot.x, plot.y);
}

/**
 * Convenience overload of the canvas context lineTo function using the getPlot
 * function above for drawing.
 *
 * @param {number} x
 * @param {number} y
 */
function lineTo(x, y) {
    var plot = getPlot(x, y);
    ctx.lineTo(plot.x, plot.y);
}

/**
 * Rounds a number to a specified decimal place.
 * @param {number} v The number to round.
 * @param {number} p The decimal place to which to round.
 * @returns rounded number
 */
function roundToPlace(v, p) {
    return Math.round(v * Math.pow(10, p)) / Math.pow(10, p);
}

/**
 * Draws the screw locations for the rails for a eurorack row.
 *
 * @param {number} panel The panel object for which to draw the rail locations.
 */
function drawPanelRail(panel) {
    let p = [];
    var circR = 3;
    var actualPanelHeight = rowUnitsH[i] * oneUnit;
    var screwDist = (actualPanelHeight - actualRailSeparation) / 2;
    var screwDistX = Math.cos(rad(panel.angle)) * screwDist;
    var screwDistY = Math.sin(rad(panel.angle)) * screwDist;
    var screwDistDepthX = Math.sin(rad(panel.angle)) * actualRailDepth;
    var screwDistDepthY = -Math.cos(rad(panel.angle)) * actualRailDepth;

    var screwX = panel.coords[0] + screwDistX + screwDistDepthX;
    var screwY = panel.coords[1] + screwDistY + screwDistDepthY;
    var plot = getPlot(screwX, screwY);

    ctx.beginPath();
    ctx.arc(plot.x, plot.y, circR, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(plot.x, plot.y, circR / 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    writeCoords(screwX, screwY, true);
    p = p.concat(screwX, screwY);

    screwX = panel.coords[2] - screwDistX + screwDistDepthX;
    screwY = panel.coords[3] - screwDistY + screwDistDepthY;
    plot = getPlot(screwX, screwY);

    ctx.beginPath();
    ctx.arc(plot.x, plot.y, circR, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(plot.x, plot.y, circR / 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    writeCoords(screwX, screwY, true);
    p = p.concat(screwX, screwY);

    return p;
}

/**
 * Draws all the panel rails holes.
 *
 * @param {array} panels
 */
function drawPanelRails(panels) {
    let p = [];
    for (var i = 0; i < panels.length; i++) {
        p = p.concat(drawPanelRail(panels[i]));
    }
    return p;
}

/**
 * Draws a path.
 * @param {array|arguments} pts Input data.
 */
function drawPath(pts) {
    if (!Array.isArray(pts)) {
        pts = Array.prototype.slice.call(arguments);
    }
    if (pts.length === 0) {
        return;
    }
    var shouldWriteCoords = true;
    if (typeof pts[0] !== "number") {
        pts.shift();
        shouldWriteCoords = false;
    }
    ctx.beginPath();
    moveTo(pts.shift(), pts.shift());
    while (pts.length > 0) {
        var x = pts.shift();
        var y = pts.shift();
        // console.info(x, y, pts[0]);
        lineTo(x, y);
        if (typeof pts[0] === "number") {
            if (shouldWriteCoords) {
                writeCoords(x, y);
            }
        } else {
            pts.shift();
        }
    }
    ctx.stroke();
    ctx.closePath();
}

/**
 * Writes the real life coordinates for a given point. This is used to label
 * the points in the drawing.
 * @param {number} x
 * @param {number} y
 * @param {boolean} showBelow
 */
function writeCoords(x, y, showBelow, offsetX, offsetY) {
    //showBelow ? showBelow = false : showBelow = true;
    var yFactor = showBelow ? -1 : 1;
    ctx.font = "10px sans-serif";
    var plot = getPlot(x, y);
    ctx.fillText(
        actualDistance(x) + ", " + actualDistance(y),
        plot.x + 5,
        plot.y - 10 * yFactor
    );
}
/*
function updateAngles() {
	const focusEL = document.activeElement;
	const aa = getActualRowAngle(i);
	const deg = document.getElementsByClassName("angle");
	for (let i = 0; i < collection.length; i++) {
		collection[i].type = "angle";
	deg.innerHTML = " deg. Angle: " + aa;
	focusEl.focus();
	return;
}
*/
/**
 * Creates the row angle inputs based on the number of rows.
 *
 * @param {number} i The row index value.
 * @param {number} value The starting value for the row input.
 * @returns
 */
function createRowInput(i, uValue, aValue) {
    const para = document.createElement("p");
    const spn = document.createElement("span");
    const unitsIdPrefix = "units-";
    const inputIdPrefix = "angle-";
    const rowInputs = document.getElementById("row-inputs");

    spn.className = "input-span";
    spn.innerHTML = `Row ${i + 1} &nbsp;`;

    const uni = document.createElement("input");
    uni.className = "number";
	//uni.type = number;  //crashes the program
    uni.value = uValue;
    uni.size = 1;
    uni.maxlength = 1;
	  uni.max = 4;
	  uni.min = 1;
	  uni.step = 1;
    uni.id = `${unitsIdPrefix}${i}`;
    uni.title = 'Press ENTER to update.';

    spn.appendChild(uni);

    const us = document.createElement("span");
    us.innerHTML = " U:  ";
    spn.appendChild(us);

    const inp = document.createElement("input");
    inp.value = aValue;
    inp.size = 2;
    inp.maxlength = 3;
    inp.title = 'Press ENTER to update.'
    inp.id = `${inputIdPrefix}${i}`;
    const onChange = (event) => {
		if (event.key !="Enter") {return}
		else {
        setTimeout(() => {
			const unitIndex = parseInt(event.target.id.split(unitsIdPrefix)[1], 10);
            rowUnitsH[unitIndex] = parseFloat(event.target.value, 10);
			unitHeight = rowUnitsH[unitIndex];
			console.info(
				"Unit Index: ", unitIndex,
				" rowUnitsH: ", rowUnitsH,
				" unitHeight: ", unitHeight,
				" Actual panel height: ",
				actualPanelHeight
			);

        const inputIndex = parseInt(event.target.id.split(inputIdPrefix)[1], 10);
        rowAngles[inputIndex] = parseFloat(event.target.value, 10);

        console.info(
            "Input change: ",
            event.target.value,
            event.target.id,
            inputIndex,
            rowAngles
            );
          drawSide();
        }, 0); } //
    };
	  uni.addEventListener("input", onChange);
    uni.addEventListener("change", onChange);
    uni.addEventListener("keypress", onChange);
    uni.addEventListener("losefocus", onChange);
    //inp.addEventListener("input", onChange);
    inp.addEventListener("blur", onChange);
    inp.addEventListener("keypress", onChange);

    spn.appendChild(inp);
    const aa = getActualRowAngle(i);
    const deg = document.createElement("span");
    deg.className = "angle";
    deg.innerHTML = " deg. Angle: " + aa;
    spn.appendChild(deg);

    rowInputs.appendChild(spn);
    rowInputs.appendChild(para);

    return inp;
}

/**
 * Redraws the row input elements.
 *
 * @param {number} c The row count.
 */
function resetRowInputs(c) {
    /*backPanelLocation = 0;*/
    const rowInputs = document.getElementById("row-inputs");
    while (rowInputs.firstChild) {
        rowInputs.removeChild(rowInputs.firstChild);
    }
	rowUnitsH = rowUnitsH.slice(0, c);
	while (rowUnitsH.length < c) {
		rowUnitsH.push(defaultUnit);
	}
    rowAngles = rowAngles.slice(0, c);
    while (rowAngles.length < c) {
        rowAngles.push(defaultAngle);
    }
    for (let i = 0; i < rowCount; i++) {
        rowInputs[i] = createRowInput(i, rowUnitsH[i], rowAngles[i]);
    }
	//The following is a hack to force the Unit input boxes to be type number
	//because the program crashes when uni.type = number is uncommented.
	const collection = document.getElementsByClassName("number");
	for (let i = 0; i < collection.length; i++) {
		collection[i].type = "number";
	}
}

/**
 * The initialization function for the page.
 */
function init() {

//Pick and set Bkground colors
//color1.addEventListener("input", setGradient);
//color2.addEventListener("input", setGradient);

	//setGradient();

    // Handle rows
    const rowCountSelector = document.getElementById("rowCount");
    rowCountSelector.value = rowCount;
    rowCounts.forEach((c, i) => {
        const newOpt = document.createElement("option");
        newOpt.value = c;
        newOpt.innerHTML = c;
        rowCountSelector.appendChild(newOpt);
        if (rowCounts[i] === rowCount) {
            newOpt.selected = true;
        }
    });
    rowCountSelector.addEventListener("change", (event) => {
        console.info("event", event.target.value);
        rowCount = event.target.value;
        resetRowInputs(rowCount);
        drawSide();
    });
    resetRowInputs(rowCount);

    inputDepth = document.getElementById("the-input-depth");
    const onModuleDepthChange = (event) => {
        setTimeout(() => {
            actualPanelDepth = parseFloat(event.target.value);
            drawSide();
        }, 0);
    };
    inputDepth.addEventListener("input", onModuleDepthChange);

    measureCb = document.getElementById("measure");
    measureCb.checked = showInches;
    const onMeasureChange = (event) => {
        setTimeout(() => {
            showInches = !event.target.checked;
			console.info("showInches: ", showInches);
            drawSide();
        }, 0);
    };
    measureCb.addEventListener("change", onMeasureChange);

    calcRiseCb = document.getElementById("calcRise");
    calcRiseCb.checked = !useStaticRise;
    const onCalcRiseChange = (event) => {
        setTimeout(() => {
            useStaticRise = !event.target.checked;
            drawSide();
        }, 0);
    };
    calcRiseCb.addEventListener("change", onCalcRiseChange);

	var firstAngle = rowAngles[0];

	frontPanelCb = document.getElementById("frontPanel");
    frontPanelCb.checked = prowTrue;
    const onFrontPanelChange = (event) => {
        setTimeout(() => {
            prowTrue = event.target.checked;
            drawSide();
        }, 0);
    };
    frontPanelCb.addEventListener("change", onFrontPanelChange);
	prowTrue ? xStart = 20 : xStart = 0;

	standardHtCb = document.getElementById("standardHt");
    standardHtCb.checked = setStandard;
    const onStandardHtChange = (event) => {
        setTimeout(() => {
            setStandard	 = event.target.checked;
            setStandard ? oneUnitStandard = unitPlp : oneUnitStandard = unitInt;
            drawSide();
        }, 0);
    };
    standardHtCb.addEventListener("change", onStandardHtChange);

    matThickness = document.getElementById("material-thickness");
    matThickness.value = caseMaterialThickness;
    const onMaterialThicknessChange = (event) => {
        setTimeout(() => {
            caseMaterialThickness = parseFloat(event.target.value);
            drawSide();
        }, 0);
    };
    matThickness.addEventListener("input", onMaterialThicknessChange);

    pxDepthInput = document.getElementById("pxDepth");
    pxDepthInput.value = pxDepth;
    const onpxDepthChange = (event) => {
        setTimeout(() => {
            pxDepth = parseFloat(event.target.value);
            panelHeight = actualPanelHeight * pxDepth;
            heightRatio = actualPanelHeight / panelHeight;
            drawSide();
        }, 0);
    };
    pxDepthInput.addEventListener("input", onpxDepthChange);

    canvasDiv = document.getElementById("canvas-div");
    canvas = document.getElementById("the-canvas");
    ctx = canvas.getContext("2d");
    w = canvasDiv.clientWidth;
    h = canvasDiv.clientHeight;
    canvas.width = w*.8;
    canvas.height = h*.8;  // h
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeStyle = "#999999";

    inputDepth.value = actualPanelDepth;

    drawSide();

    window.onresize = function () {
        backPanelLocation = 0;
        w = canvasDiv.clientWidth;
        h = canvasDiv.clientHeight;
        // console.info(w,h);
        canvas.width = w*.8;
        canvas.height = h*.8;
        ctx.clearRect(0, 0, w, h);
        drawSide();
    };
}

var setCookie = function (n, val) {
    var exdays = 30;
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = n + "=" + val + "; " + expires;
};

var getCookie = function (n) {
    var name = n + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

document.onclick = function(e) {
    if (e.target.className == 'sqr') {
        var favColor = e.target.style.backgroundColor;
        setCookie('color', favColor);
        document.body.style.backgroundColor = favColor;
    };
};

/*
window.onload = function() {
    var favColor = document.body.style.backgroundColor;
    var color = getCookie('color');
    if (color === '') {
        document.body.style.backgroundColor = favColor;
    } else {
      document.body.style.backgroundColor = color;
    };
	let cssPre = getCssValuePrefix();
	console.info(
		"CSS Prefix = ", cssPre
	);
};
*/
	// send the starting value of the slider to output
	//output.innerHTML = slider.value;

// Detect which browser prefix to use for the specified CSS value
// (e.g., background-image: -moz-linear-gradient(...);
//        background-image:   -o-linear-gradient(...); etc).
//

function getCssValuePrefix(){
    var rtrnVal = '';//default to standard syntax
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    let temporary = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++)
    {
        // Attempt to set the style
        temporary.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
		let a
        if (temporary.style.background != "")
			a = temporary.style.background;
            rtrnVal = prefixes[i];
    }

    temporary = null; //free to be garbage collected
    //delete temporary;  //delete var has been depricated and will throw an error in strict mode.

    return rtrnVal;
}
/*
function randomColor() {
	const newColor = Math.floor(Math.random()*16777215).toString(16);
	return newColor;
}

function randomGradient() {
	var bod = document.getElementById("body");
	var prefix = getCssValuePrefix();
	const style = getComputedStyle(body);
	const background = style.background;
	console.info("oldStyle: ", background);
	var orentation = Math.floor(Math.random() * 360);
	var random1 = "#" + randomColor();
	var random2 = "#" + randomColor();
	console.info("funct randomGradient prefix, orentation",prefix, " ", orentation, " random1: ", random1, " random2: ", random2);
	var myStyle = prefix + "linear-gradient(" + orentation + "deg, " + random1 + ", " + random2 +");";
	console.info("myStyle: ", myStyle);
	document.body.style.background = myStyle;
	var newStyle = bod.style.background;
	console.info("newStyle: ", newStyle.value, " background: ", background);
}

*/
/* set2Gradient was my first attempt at this I changed the name of the function
to avoid commenting it out */
function set2Gradient(){
	var prefix = getCssValuePrefix();
	console.info("Start setGradient orentation, color1, color2", orentation, " ",
  color1, " ", color2);
	orentation ? orentation : orentation = 135;
		bod = prefix + "linear-gradient(" + orentation + "deg, #" + color1 + ", #" +
    color2 + ")";
		color1 = document.querySelector("color1");
		color2 = document.querySelector("color2");

		console.info("setGradient mid orentation: ", orentation, " color1: ",
    color1.value, " color2 ", color2.value, " Gradient$ ", newGradient,
    "myGradient: ", myGradient);
		bod.style.background = newGradient;
}


//Change the background on color selection.

function setGradient() {
    'use strict';
	var x = document.getElementsByTagName("body")[0];
    var bgs = x.style.background;
    var orentation = slider.value;
	bod.style.background = "linear-gradient(" + orentation + "deg, " + color1.value + ", " + color2.value + ")";
    //clr1.innerHTML = color1.value;
    //clr2.innerHTML = color2.value;
	//var outString = document.getElementById("outCurrent");
	//outString.innerHTML = bgs;
}

function dice() {
	'use strict';
	var roll = Math.floor(Math.random()*256).toString(16);
	if (roll.length < 2) {roll = roll + roll};
	console.info("roll: " + roll);
	return roll;
}

function randomColor() {
	'use strict';
	var red = dice(), green = dice(), blue=dice();
	var newColor = "#" + red + green + blue;
	console.info("newColor: " + newColor);
	return newColor;
}

function getRandomColor() {
    'use strict';
	var rndColor1 = randomColor(), rndColor2 = randomColor(), orentation = Math.floor(Math.random() * 360);
    bod.style.background = "linear-gradient(" + orentation + "deg, " + rndColor1 + ", " + rndColor2 + ")";
    document.getElementById("rotation").value = orentation;
    output.innerHTML = orentation;
	var c1 = document.querySelector(".color1")
	c1.value = rndColor1;
	var c2 = document.querySelector(".color2")
	c2.value = rndColor2;
}

function newRow() {
  var table = document.getElementById("materialList");
  var tbodyRowCount = table.tBodies[0].rows.length;
  var nRow = tbodyRowCount + 1;
  var row = table.tbody.insertRow(nRow);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
}

function delRow() {
  var table = document.getElementById("materialList");
  var tbodyRowCount = table.tBodies[0].rows.length;
    if (tbodyRowCount = 1) {showHide("delRowBtn");}
    else {
      var xRow = tbodyRowCount - 1;
      document.getElementById("materialList").deleteRow(xRow);
    };
}

/*

function scale (var s){
    var img = drawSide();
    (s = "fit") ? drawImageScaled;
}

function drawImageScaled(img, ctx) {
   var canvas = ctx.canvas ;
   var hRatio = canvas.width  / img.width    ;
   var vRatio =  canvas.height / img.height  ;
   var ratio  = Math.min ( hRatio, vRatio );
   var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
   var centerShift_y = ( canvas.height - img.height*ratio ) / 2;
   ctx.clearRect(0,0,canvas.width, canvas.height);
   ctx.drawImage(img, 0,0, img.width, img.height,
                 centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);
}
*/
/* The following are notes for 3D manipulation.  Place the trihedron at the
center of a "sphere" touching drawing at outermost points.  i.e. this 3d drawing
would fit in a box LxWxH, this box would fit a sphere with radius of r place
trihedron x,y,z at 0,0,0 and redraw the obj.  Use mouse down to grab and drag obj,
redraw obj */
/*funtion trihedron(){
    const frontBotLeft = x1, y1, z1; //Typically 0,0,0
    const backTopRight = x2, y2, z2; //Typically positive numbers
    zScale = 45deg +-15deg // Probably not needed;   set it at 45deg.
    set a horizon line at 2/5 the height of the canvas.  Paint the top half a
    gradiant of white to dark blue, pain the bottom half a texture of dark gray.
    r = (distance frontBotLeft, backTopRight)/2;
}

function 3D(){
	let inside = hp * hpCount;
	console.info("HP length: ", inside);
	//separation of left and right sides of case equals the total HP from inside
  left to inside right.
	var overAllWidth = inside + (sideThickness * 2);
}
*/
