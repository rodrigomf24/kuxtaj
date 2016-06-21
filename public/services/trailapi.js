// https://trailapi-trailapi.p.mashape.com/?lat=38.5496965&limit=25&lon=-121.1186154&q[activities_activity_type_name_eq]=hiking&q[state_cont]=California&radius=25
var TrailApi = function(searchParameters) {
  this.endpoint = 'https://trailapi-trailapi.p.mashape.com/';
  var defaultParameters = {
    lat:0,
    lon:0,
    radius:0, // Miles radius from lat and lon
    limit:0,
    q:{
      activities_activity_type_name_eq:void(0), // Outdoor activity name
      activities_activity_name_cont:void(0), // Name of specific park or trail
      city_cont:void(0), // Name of a city
      country_cont:void(0), // Name of a country
      state_cont:void(0) // Name of a state
    }
  };
  this.searchParameters = (typeof(searchParameters) === 'object' && Object.keys.length(searchParameters) > 0) 
    ? Object.assign(defaultParameters, searchParameters)
    : defaultParameters;
};
  
TrailApi.prototype.requestPlaces = function () {
  var that = this;
  return new Promise(function(resolve, reject) {
    var querystring = '';
    for(var field in that.searchParameters) {
      var value = that.searchParameters[field];
      if(value !== void(0)) {
        if(typeof(value) === 'object') {
          for(var fieldChild in value) {
            if(value[fieldChild] !== void(0)) {
              querystring += (querystring.length === 0) ? '?'+field+'['+fieldChild+']='+value[fieldChild] : '&'+field+'['+fieldChild+']='+value[fieldChild];
            }
          }
        } else {
          querystring += (querystring.length === 0) ? '?'+field+'='+value : '&'+field+'='+value;
        }
      }
    }
    $.ajax({
      url:that.endpoint+querystring,
      dataType:'json',
      method:'GET',
      headers:{
        'X-Mashape-Key':'eMhQjSrNCmmshpuDm5C4Pr4nJF5Sp1DoHGqjsn7IdWZOjQXSxW' // test api key
      },
      success:function(data) {
        if(typeof(data) === 'object' && data.places) {
          resolve(data.places);
        } else {
          resolve([]);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
        reject(err);
      }.bind(this)
    });
  });
};
  
TrailApi.prototype.setSearchParameters = function (searchParameters) {
  this.searchParameters = Object.assign(this.searchParameters, searchParameters);
};