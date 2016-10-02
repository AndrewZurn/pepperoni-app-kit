import {connect} from 'react-redux';
import ScheduleView from './ScheduleView';

export default connect(
    state => ({
      workouts: state.getIn(['scheduleState', 'workouts']),
    })
)(ScheduleView);
