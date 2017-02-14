import {connect} from 'react-redux';
import ScheduleView from './ScheduleView';

export default connect(
    state => ({
      groupWorkouts: state.getIn(['scheduleState', 'groupWorkouts']),
      smallGroupWorkouts: state.getIn(['scheduleState', 'smallGroupWorkouts']),
      pilatesWorkouts: state.getIn(['scheduleState', 'pilatesWorkouts']),
      events: state.getIn(['scheduleState', 'events'])
    })
)(ScheduleView);
