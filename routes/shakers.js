var express     = require('express'),
    shakerRouter= express.Router(),
    request     = require('request'),
    oauthSignature = require('oauth-signature'),
    n           = require('nonce')(),
    qs          = require('querystring'),
    _           = require('lodash')


shakerRouter.post('/result', function(req,res) {
  var category;
  if (req.body.cuisines !== undefined) {
      category = req.body.cuisines.toString()
  } else {
    category = "restaurants"
  }


  var current_search = {
    location: req.body.location,
    term: req.body.term,
    cll: req.body.cll,
    category_filter: category
  }

  var request_yelp = function(set_parameters) {

    var httpMethod = 'GET'
    var url = 'http://api.yelp.com/v2/search'
  /* We set the require parameters here */
    var required_parameters = {
      oauth_consumer_key : "aXYVJiMRADRj7lPUeQwiqg",
      oauth_token : "3rxm2icV9K7TMdf8e2-uYAbKS0IIbptm",
      oauth_nonce : n(),
      oauth_timestamp : n().toString().substr(0,10),
      oauth_signature_method : 'HMAC-SHA1',
      oauth_version : '1.0'
    };
    /* We combine all the parameters in order of importance */
    var parameters = _.assign(set_parameters, required_parameters);
    /* We set our secrets here */
    var consumerSecret = "6I0h-1lPyTLDPD8Avq86HwiMVOM";
    var tokenSecret = "F2teTYsVWz7eGpkm5p8_9_XsbD4";

    /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
    /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
    var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

    /* We add the signature to the list of paramters */
    parameters.oauth_signature = signature;

    /* Then we turn the paramters object, to a query string */
    var paramURL = qs.stringify(parameters);

    /* Add the query string to the url */
    var apiURL = url+'?'+paramURL;

  console.log(apiURL)
   request(apiURL, function(error, response, body){
     var random = Math.floor((Math.random() * 20))
     var chosen = JSON.parse(body).businesses[random]
      // var name = chosen["name"]
      // var review_count = chosen["review_count"]
      // var rating = chosen["rating"]
      // var image = chosen["image_url"]
      //
      // var display_phone = chosen["display_phone"]
      // var rating_img_small = chosen[""]
      // res.send(chosen)
    res.render('result', {chosen: chosen, user:req.user})
  })
}

request_yelp(current_search)
})



module.exports = shakerRouter
