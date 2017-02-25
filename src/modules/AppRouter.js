/*eslint-disable react/prop-types*/

import React from 'react';
import HomeViewContainer from './home/HomeViewContainer';
import ScheduleViewContainer from './schedule/ScheduleViewContainer';
import AthleticsViewContainer from './athletics/AthleticsViewContainer';

export const WORKOUT_INDEX = 1;

export function isInView(state, index) {
  return state.getIn(['navigationState', 'index']) === index;
}

/**
 * AppRouter is responsible for mapping a navigator scene to a view
 */
export default function AppRouter(props) {
  const key = props.scene.route.key;

  if (key === 'Home') {
    return <HomeViewContainer />;
  }

  if (key.indexOf('Athletics') === 0) {
    return (
      <AthleticsViewContainer scheduleType='group' />
    );
  }

  if (key.indexOf('GroupSchedule') === 0) {
    return (
      <ScheduleViewContainer scheduleType='group' />
    );
  }

  if (key.indexOf('SmallGroupSchedule') === 0) {
    return (
      <ScheduleViewContainer scheduleType='small_group' />
    );
  }

  if (key.indexOf('PilatesSchedule') === 0) {
    return (
      <ScheduleViewContainer scheduleType='pilates' />
    );
  }

  if (key.indexOf('Events') === 0) {
    return (
        <ScheduleViewContainer scheduleType='events' />
    );
  }

  throw new Error('Unknown navigation key: ' + key);
}
