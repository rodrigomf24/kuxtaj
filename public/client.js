// http://www.transitandtrails.org/api
// https://www.data.gov/developers/apis
// https://market.mashape.com/trailapi/trailapi
//<input type="text" className="form-control" value={this.state.phrase} onChange={this.handlePhraseChange} onKeyDown={this.handlePhraseKeyDown} placeholder="search by..." />

var SearchBar = React.createClass({
  getInitialState: function() {
    return {phrase:''};
  },
  handlePhraseChange: function(e) {
    this.setState({phrase:e.target.value});
  },
  handleSearchButtonClick: function() {
    if(typeof(this.props.onSearchEvent) === 'function') {
      this.props.onSearchEvent(this.state.phrase);
    }
  },
  handlePhraseKeyDown: function(e) {
    if(e.which === '13' || e.which === 13) {
      this.handleSearchButtonClick();
    }
  },
  render: function() {
    return (
      <div className="row search-title">
        <div className="col-sm-12">
          <div className="row">
            <h1>Outdoor activities near you</h1> <small>Click the button bellow and get out there!</small>
          </div>
          <div className="row">
            <button type="button" className="btn btn-lg btn-info-outline" onClick={this.handleSearchButtonClick}>
                Discover Activities
            </button>
          </div>
        </div>
      </div>
    );
  }
});

var Place = React.createClass({
  render: function() {
    var panelId = 'panel'+this.props.info.unique_id+'d',
        listOfActivities = (typeof(this.props.info.activities) === 'object' && this.props.info.activities.length > 0) ?
          this.props.info.activities.reduce(function(acc, curr) {
            if(acc.indexOf(curr.activity_type_name) === -1) {
              acc.push((<span className="label label-info">{curr.activity_type_name}</span>));
              return acc;
            } else {
              return acc;
            }
          }, []) : [];
    return (
      <div className="card">
        <img className="card-img-top" src="https://cdn.hyperdev.com/us-east-1%3Ad02d36eb-f259-4c48-8ac3-a7d2294b2ca6%2Fmountain-icon.png" alt="Card image cap" />
        <div className="card-block">
          <h4 className="card-title">{this.props.info.name}</h4>
          <ul className="activity-main-info">
            <li>City: {this.props.info.city}</li>
            <li>State: {this.props.info.state}</li>
            <li>Country: {this.props.info.country}</li>
            <li><em>Latitude: {this.props.info.lat} | Longitude: {this.props.info.lon}</em></li>
            <li>Activities: {listOfActivities}</li>
          </ul>
          <p className="card-text activity-description">
            {(this.props.info.description !== null && this.props.info.description !== void(0) && this.props.info.description !== '') ? this.props.info.description.substr(0, 150)+'...' : 'Description not available...'}
          </p>
        </div>
      </div>
    );
  }
});

var PlacesList = React.createClass({
  render: function() {
    let places;
    if(typeof(this.props.places) === 'object' && this.props.places.length > 0) {
      var count = 0;
      places = this.props.places.reduce(function(acc, curr, index) {
        var place = (
          <div key={'place_'+index} className="col-sm-4">
            <Place info={curr} />
          </div>  
        );
        
        if(count === 0) {
          acc.push([place]);
          count++;
          return acc;
        } else {
          if(count < 3) {
            acc[(acc.length - 1)].push(place);
            if(count === 2) {
              count = 0;
            } else {
              count++;
            }
            return acc;
          }
        }
      }, []).map(function(list, index) {
        return (
          <div key={'places_row_'+index} className="row">
            {list}
          </div>
        );
      });
    } else {
      places = '';
    }
    return (
      <div className="row">
        <div className="col-sm-12">
          {places}
        </div>
      </div>
    )
  }
});

var PlaceInfo = React.createClass({
  render: function() {
    return (
      <div></div>  
    );
  }
});

var OutdoorApp = React.createClass({
  getInitialState: function() {
    return {
      lat:void(0),
      lng:void(0),
      limit:25,
      radius:25,
      places:[],
      api:new TrailApi()
    };
  },
  componentDidMount: function() {
    if (navigator.geolocation) {
      var that = this;
      navigator.geolocation.getCurrentPosition(function(position) {
        that.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, function() {
        alert('Browser doesn\'t support Geolocation');  
      });
    } else {
      // Browser doesn't support Geolocation
      alert('Browser doesn\'t support Geolocation');
    }
  },
  handleSearchEvent: function() {
    this.state.api.setSearchParameters({
      lat:this.state.lat,
      lon:this.state.lng,
      radius:this.state.radius
    });
    var that = this;
    this.state.api.requestPlaces().then(function(response) {
      that.setState({places:response});
    });
  },
  render: function() {
    return (
      <div>
        <div className="masthead clearfix">
          <div className="inner">
            <h3 className="masthead-brand">Kuxtaj App</h3>
            <nav className="nav nav-masthead"></nav>
          </div>
        </div>
        <div className="inner cover">
          <SearchBar onSearchEvent={this.handleSearchEvent} />
          <PlacesList places={this.state.places} />
        </div>
        <div className="mastfoot">
          <div className="inner">
            By <a href="https://www.linkedin.com/in/rmdevgt" target="_blank">rmdevgt.com</a>
          </div>
        </div>
      </div>
    ) 
  }
});

var Router = window.ReactRouter.Router,
    Route = window.ReactRouter.Route,
    Link = window.ReactRouter.Link, browserHistory = window.ReactRouter.browserHistory;

ReactDOM.render((
  <Router>
    <Route path="/" component={OutdoorApp}>
      <Route path="place-info" component={PlaceInfo} />
    </Route>
  </Router>),
  document.getElementById('app')
);

/*<Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>*/