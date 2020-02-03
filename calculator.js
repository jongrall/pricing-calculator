<div class="groupRateCalculator">
  <div class="question">
  <label for="groupSizeSlider">How many people need photos?</label>
  <div class="inputBlock">
  <input type="range" min="3" max="20" value="3" class="slider" id="groupSizeSlider">
  <input type="text" name="groupSize" id="groupSizeInput"><br />
  <div class="subquestion"><input type="checkbox" name="teamShotPredicate" value="teamShot">  I also want a team photo</div></div></div>
  <div class="question">
  <label for="shootType">Where are we shooting?</label>
  <div class="inputBlock">
  <input type="radio" name="shootType" value="studio" checked="checked"> In Studio (Montclair, NJ)<br />
  <input type="radio" name="shootType" value="location"> On Location (We Go to You)<br />
  <p id="locationFeeDisclaimer">There is a $200 setup fee for on location shoots as well as additional travel expenses to and from location TBD.</p></div></div>
  <p id="calculatorResult"><span id="perPersonCost"></span> per person<br />
    Estimated total: <span id="totalCost"></span></p>
</div>

<script type="text/javascript">
const minGroupSize = 3;
const defaultGroupSize = 3;
const smallGroupMax = 5;
const mediumGroupMax = 10;
const maxGroupSize = 20;

// Grab the form fields
var slider = document.getElementById('groupSizeSlider');
var sizeInput = document.getElementById('groupSizeInput');
var teamShotPredicate = document.getElementsByName('teamShotPredicate')[0];
var shootTypes = document.getElementsByName('shootType');

// Grab the displayed cost fields
var perPersonCostElt = document.getElementById('perPersonCost');
var totalCostElt = document.getElementById('totalCost');

//////////////////////// HELPER FUNCTIONS ///////////////////////////
function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

//////////////////////// VIEW UPDATE FUNCTIONS ///////////////////////////
function recalculate() {
	const baseGroupCost = 1000;
	const groupLocationFee = 200;
	const incrementalCostSmallGroup = 150;
	const incrementalCostMediumGroup = 100;
	const incrementalCostLargeGroup = 75;
	const teamShotSmallGroup = 100;
	const teamShotMediumGroup = 150;
	const teamShotLargeGroup = 200;
	
	console.log('recalculating');

	var totalCost = baseGroupCost;
	var teamShotCost = teamShotSmallGroup;
	var groupSize = slider.value;
	
	// Small group
	if (groupSize <= smallGroupMax) {
		totalCost = baseGroupCost + ((groupSize - minGroupSize) * incrementalCostSmallGroup);
	}
	// Medium group
	else if (groupSize <= mediumGroupMax) {
		totalCost = baseGroupCost + ((smallGroupMax - minGroupSize) * incrementalCostSmallGroup) + ((groupSize - smallGroupMax) * incrementalCostMediumGroup);
		teamShotCost = teamShotMediumGroup;
	}
	// Large group
	else if (groupSize <= maxGroupSize) {
		totalCost = baseGroupCost + ((smallGroupMax - minGroupSize) * incrementalCostSmallGroup) + ((mediumGroupMax - smallGroupMax) * incrementalCostMediumGroup) + ((groupSize - mediumGroupMax) * incrementalCostLargeGroup);
		teamShotCost = teamShotLargeGroup;
	}
	
	// Add in the cost of a team shot, if appropriate
	if (teamShotPredicate.checked) {
		totalCost += teamShotCost;
	}
	
	// Add in the cost of a location shoot, if appropriate
	for(i = 0; i < shootTypes.length; i++) {
		var choice = shootTypes[i];
		if (choice.value == 'location' && choice.checked) {
			totalCost += groupLocationFee;
			break;
		}
	}
	
	perPersonCostElt.innerHTML = '$' + Math.floor(totalCost / groupSize);
	totalCostElt.innerHTML = '$' + totalCost;
}

function updateSizeInputValue(e) {
	sizeInput.value = e.target.value;
	checkGroupTooLargeForStudio();
	recalculate();
}

function updateSliderValue(e) {
  var enteredValue = e.target.value.trim();
  
  // Set back to default if slider is blank
  if (enteredValue == '') {
  	slider.value = defaultGroupSize;
	checkGroupTooLargeForStudio();
	recalculate();
  }
  // Try to parse an integer
  else if (isNormalInteger(enteredValue)) {
    // Limit to the acceptable range
    var limitedValue = Math.min(Math.max(minGroupSize, enteredValue), maxGroupSize);
  	slider.value = limitedValue;
    sizeInput.value = limitedValue;
	checkGroupTooLargeForStudio();
	recalculate();
  }
}

function updateOnFocusOut(e) {
	updateSliderValue(e);
	checkGroupTooLargeForStudio();
	sizeInput.value = slider.value;
	recalculate();
}

function checkGroupTooLargeForStudio() {
	if (slider.value > smallGroupMax) {
		for(i = 0; i < shootTypes.length; i++) {
			var choice = shootTypes[i];
			if (choice.value == 'location') {
				choice.checked = true;
			}
			else if (choice.value == 'studio') {
				choice.checked = false;
				choice.disabled = true;
			}
		}
	}
	else { // Enable studio shoots for small groups
		for(i = 0; i < shootTypes.length; i++) {
			var choice = shootTypes[i];
			if (choice.value == 'studio') {
				choice.disabled = false;
			}
		}
	}
}

//////////////////////// INITIALIZATION ///////////////////////////
sizeInput.value = defaultGroupSize;
recalculate();

//////////////////////// EVENT LISTENERS ///////////////////////////

// Update the displayed value as you drag the slider
slider.addEventListener('input', updateSizeInputValue);

// Update the slider if they type in a value
sizeInput.addEventListener('input', updateSliderValue);

// Update the slider and input value to a sane value as they focus out of the text field
sizeInput.addEventListener('focusout', updateOnFocusOut);

// Recalculate when they check/uncheck team shot
teamShotPredicate.addEventListener('change', recalculate);

// Recalculate when they change the shoot type
for(i = 0; i < shootTypes.length; i++) {
	var choice = shootTypes[i];
	choice.addEventListener('change', recalculate);
}

</script>