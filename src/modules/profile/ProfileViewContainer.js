import {connect} from 'react-redux';
import ProfileView from './ProfileView';

export default connect(
    state => ({
      completedWorkouts: state.getIn(['profileState', 'completedWorkouts']),
      fusionUser: state.getIn(['auth', 'fusionUser'])
    })
)(ProfileView);
