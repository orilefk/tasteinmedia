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

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showRecommendation = function(recommendation) {
	
	// clone our result template code
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
	urlElem.attr('href', recommendation.yUrl);
	urlElem.text('Play on YouTube');

	return result;
};


// this function takes the results object from StackOverflow
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
	
	// the parameters we need to pass in our request to StackOverflow's API
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

		$('.search-results').html(recommendationResults).delay(1000);

		$.each(result.Similar.Results, function(i, item) {
			var recommendation = showRecommendation(item);
			$('.results').append(recommendation).delay(1000);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});

};

var moveUp = function(){
	$('body').fadeOut(500,function(){
		$('#search-area').removeClass('stack');
		$('#search-area').addClass('stack-after-search');
		$(this).fadeIn(500);
	});
}




