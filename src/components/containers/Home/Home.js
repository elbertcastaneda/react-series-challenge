import React, { Component } from 'react';
import { HomeContainer } from './Home.styled';
import { connect } from 'react-redux';
import trendingGifsActions from '../../../actions/trendingGifs';
const { creators } = trendingGifsActions;
const { getTrendingGifsRequested } = creators;
class Home extends Component {
  componentDidMount () {
    const { getTrendingGifsRequested } = this.props;
    getTrendingGifsRequested();
  }

  render() {
    const {trendingGifs} = this.props;
    return (
      <HomeContainer>
        Home
        <hr />
        {JSON.stringify(trendingGifs)}
      </HomeContainer>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('​mapStateToProps -> state', state);
  const {trendingGifs} = state;

  return {
    trendingGifs
  };
};

export default connect(mapStateToProps, { getTrendingGifsRequested })(Home);
