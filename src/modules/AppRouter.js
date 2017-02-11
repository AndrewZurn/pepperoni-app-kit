/*eslint-disable react/prop-types*/

import React from 'react';
import HomeViewContainer from './home/HomeViewContainer';
import WorkoutViewContainer from './workout/WorkoutViewContainer';
import WorkoutDetailsViewContainer from './workout/workoutDetails/WorkoutDetailsViewContainer';
import ScheduleViewContainer from './schedule/ScheduleViewContainer';
import ProfileViewContainer from './profile/ProfileViewContainer';

export const HOME_INDEX = 0;
export const WORKOUT_INDEX = 1;
export const SCHEDULE_INDEX = 2;
export const PROFILE_INDEX = 3;

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
      <WorkoutViewContainer />
    );
  }

  if (key.indexOf('DetailsForWorkout') === 0) {
    return (
        <WorkoutDetailsViewContainer />
    );
  }

  if (key.indexOf('Events') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
        <ScheduleViewContainer index={index} />
    );
  }

  throw new Error('Unknown navigation key: ' + key);
}
