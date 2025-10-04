export const teacherMenu = [
  { path: '/teacher/home',        icon: 'home',     label: '首页' },
  { path: '/teacher/messages',    icon: 'bell',     label: '我的消息' },
  { path: '/teacher/schedule',    icon: 'calendar', label: '我的课表' },
  { path: '/teacher/prepare',     icon: 'note',     label: '我的备课' },
  { path: '/teacher/assignments', icon: 'tasks',    label: '我的作业' },
  { path: '/teacher/grade',       icon: 'chart',    label: '我的成绩' }
];
export type TeacherMenuItem = typeof teacherMenu[number];
