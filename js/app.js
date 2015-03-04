$(document).ready( function() {
	$('.search').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();

		getRecommendation(tags);
		moveUp();
	});
});

// this function takes the recommendation object returned by tastekid 
// and creates new results to be appended to DOM
var showRecommendation = function(recommendation) {
	
	// clone the result template code
	var result = $('.templates .question').clone();
	
	// Set the title properties in result
	var titleElem = result.find('.question-text a');
	titleElem.attr('href', recommendation.wUrl);
	titleElem.text(recommendation.Name);

	var typeElem = result.find('.media-type');
	typeElem.text(recommendation.Type);

	var detailsElem = result.find('.details');
	detailsElem.text(recommendation.wTeaser);

	var urlElem = result.find('.youtube-url a');
	if(recommendation.Type == 'music') {
		urlElem.attr('href', recommendation.yUrl);
		urlElem.text('Play on YouTube');
	} else {
		$('.youtube-url').hide();
	}

	return result;
};


// this function takes the results object from tastekid
// and creates info about search results to be appended to DOM
var showRecommendationResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on TasteKid
var getRecommendation = function(tags) {

	$('.results-container').hide();
	// the parameters we need to pass in our request to Tasetkid's API
	var request = {q: tags,
				   info: '1',
				   k: '125776-TasteinM-EHMYH8Z0'};
	
	var result = $.ajax({
		url: "http://tastekid.com/api/similar",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var recommendationResults = showRecommendationResults(request.q, result.Similar.Results.length);
		$('.search-results').html(recommendationResults);

		$.each(result.Similar.Results, function(i, item) {
			var recommendation = showRecommendation(item);
			$('.results').append(recommendation);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});

};

var moveUp = function(){
	if ($('#search-area').hasClass('stack')) {
		$('#search-area').fadeOut(500,function(){
			$(this).removeClass('stack').addClass('stack-after-search')
			.fadeIn(500, showResults);
		});
	} else {
		showResults();
	}

}

var showResults = function(){
	$('.results-container').fadeIn(250);
}




