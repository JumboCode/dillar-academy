import { Route, Switch } from "wouter";
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import SignUp from '@/pages/onboarding/SignUp';
import Login from '@/pages/onboarding/Login';
import ClassesPage from '@/pages/ClassesPage';
import LevelsPage from '@/pages/LevelsPage';
import ForgotPassword from "@/pages/onboarding/ForgotPassword";
import ResetPasswordCode from "@/pages/onboarding/ResetPasswordCode";
import ResetPassword from "@/pages/onboarding/ResetPassword";
import StudentPortal from '@/pages/dashboards/StudentPortal';
import AdminLevels from '@/pages/dashboards/admin/AdminLevels';
import AdminConversations from '@/pages/dashboards/admin/AdminConversations';
import AdminStudents from '@/pages/dashboards/admin/AdminStudents';
import AdminTeachers from '@/pages/dashboards/admin/AdminTeachers';
import AdminSchedule from '@/pages/dashboards/admin/AdminSchedule';
import EditLevel from '@/pages/dashboards/admin/editPages/EditLevel';
import EditClass from '@/pages/dashboards/admin/editPages/EditClass';
import EditConversation from '@/pages/dashboards/admin/editPages/EditConversation';
import EditStudent from '@/pages/dashboards/admin/editPages/EditStudent';
import TeacherView from '@/pages/dashboards/TeacherView';
import PageNotFound from '@/pages/PageNotFound';
import StyleGuide from "@/pages/StyleGuide";

export default function PageRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/levels" component={LevelsPage} />
      <Route path="/levels/:id/classes" component={ClassesPage} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password-code" component={ResetPasswordCode} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/student" component={StudentPortal} />
      <Route path="/admin/levels" component={AdminLevels} />
      <Route path="/admin/levels/conversations" component={AdminConversations} />
      <Route path="/admin/levels/:id" component={EditLevel} />
      <Route path="/admin/levels/conversations/:id" component={EditConversation} />
      <Route path="/admin/class/:classId" component={EditClass} />
      <Route path="/admin/students" component={AdminStudents} />
      <Route path="/admin/students/:id" component={EditStudent} />
      <Route path="/admin/teachers" component={AdminTeachers} />
      <Route path="/admin/schedule" component={AdminSchedule} />
      <Route path="/teacher" component={TeacherView} />
      <Route path="/style" component={StyleGuide} />
      <Route component={PageNotFound} />
    </Switch>
  );
}
