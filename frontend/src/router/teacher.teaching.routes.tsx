import TeachingIndex from '../pages/teacher/teaching';
import TeachingToday from '../pages/teacher/teaching/Today';
import TeachingHistory from '../pages/teacher/teaching/History';
import TeachingSession from '../pages/teacher/teaching/Session';

/** 可在你的教师端路由里引入：
 * import { teachingRoutes } from './teacher.teaching.routes';
 * ...
 * children: [
 *   ...teachingRoutes,
 * ]
 */
export const teachingRoutes = [
  { path: 'teaching', element: <TeachingIndex />, children: [
    { index: true, element: <TeachingToday /> },
    { path: 'history', element: <TeachingHistory /> },
    { path: 'session/:id', element: <TeachingSession /> },
  ]},
];
