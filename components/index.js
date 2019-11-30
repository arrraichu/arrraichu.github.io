import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { flow } from 'lodash';

import {
  Header,
  SkipToContent,
  HeaderName
} from 'carbon-components-react';

class App extends Component {
  componentDidMount() {

  }

  render() {
    const { match, location, history } = this.props;
    // console.log('PROPS:', this.props);

    return (
      <h1>come back later</h1>
    );
  }
};

App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = {

};

export default _.flow([
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
])(App);
