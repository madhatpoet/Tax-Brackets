//Set default values
var starting_income = 40000;
var min_income = 0;
var max_income = 10**12 //1 Trillion Dollars
var max_slider_value = 750000
var breaks = [0,9525,38700,82500,157500,200000,500000];
var rates = [10,12,22,24,32,35,37];

//Initial Setup
updateRatesTable();
$("#income").val(starting_income).attr("min",min_income).attr("max",max_income);
updateTax();

//Updates taxes when #income loses focus
$( "#income" ).focusout(function(){updateTax();});

//Updates taxes when pressing enter
$( "#income" ).keypress(function(){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13')
	{
		updateTax();
	}
});

//Slider Code
$("#slider").slider({
	min: 0,
	max: max_slider_value,
	step: 1,
	values: breaks,
	slide: function(event, ui) {
			for (var i = 0; i < ui.values.length; ++i) {
				$("input.sliderValue[data-index=" + i + "]").val(ui.values[i]);
			}
			breaks = ui.values.slice(0);
			breaks.sort(function(a, b){return a-b});
			updateTax();
		}
});

function updateRatesTable()
{
	for(var i = 0; i < rates.length; i++)
	{
		var j = i + 1;
		var min = breaks[i] + 1;
		var rate = rates[i];
		var max;
		if(j<rates.length)
		{
			max = breaks[j];
			$("#max" + j).html("$" + max);
		}
		else
		{
			$("#max" + j).html("---------");
		}
		$("#min" + j).html("$" + min);
		$("#rate" + j).html("" + rate + "%");
	}
}

function updateTax()
{
	//Setup
	var income = getIncome();

	//Calculate
	var tax = calculateTax(income);
	var actual_rate;
	if(income>0)
	{
		actual_rate = (tax / income) * 100;
	}
	else
	{
		actual_rate = 0;
	}

	//Update Page
	$("#tax").html("$" + Number( tax.toFixed(2) ) );
	$("#actual-rate").html("" + Number((actual_rate).toFixed(2)) + "%");
}

function getIncome()
{
	var income = $("#income").val();
	if(income<min_income)
	{
		income = min_income;
	}
	if(income>max_income)
	{
		income = max_income;
		alert("Income too high for this calculator.");
	}
	$("#income").val(income);
	return income;
}

function calculateTax(income)
{
	//Initialize tax
	tax = 0.0;

	//Check all brackets
	for(var i = 0; i < rates.length; i++)
	{
		var j = i + 1;
		var min = breaks[i];
		var rate = rates[i];
		var max;
		if(j<rates.length)
		{
			max = breaks[j];
		}

		var r = rate / 100;
		var n;
		if(j==rates.length)
		{
			n = income - min;
		}
		else
		{
			if(income>=max)
			{
				n = max - min;
			}
			else
			{
				n = income - min;
			}
		}
		//Checks if final bracket has been reached
		if(n<0)
		{
			break;
		}
		tax += n*r;
	}

	return tax;
}
