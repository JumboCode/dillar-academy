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
import AddLevel from '@/pages/dashboards/admin/editPages/AddLevel';
import EditClass from '@/pages/dashboards/admin/editPages/EditClass';
import AddClass from '@/pages/dashboards/admin/editPages/AddClass';
import EditConversation from '@/pages/dashboards/admin/editPages/EditConversation';
import AddConversation from '@/pages/dashboards/admin/editPages/AddConversation';
import EditUser from '@/pages/dashboards/admin/editPages/EditUser';
import TeacherView from '@/pages/dashboards/TeacherView';
import EditTeacher from '@/pages/dashboards/EditTeacher';
import PageNotFound from '@/pages/PageNotFound';
import StyleGuide from "@/pages/StyleGuide";
// TODO
import TeacherEditClass from '@/pages/dashboards/TeacherEditClass';
import UserEditStudent from "../pages/dashboards/UserEditStudent";

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
      <Route path="/user/:id" component={UserEditStudent} />
      <Route path="/admin/levels" component={AdminLevels} />
      <Route path="/admin/levels/conversations" component={AdminConversations} />
      <Route path="/admin/levels/conversations/new" component={AddConversation} />
      <Route path="/admin/levels/conversations/:id" component={EditConversation} />
      <Route path="/admin/levels/new" component={AddLevel} />
      <Route path="/admin/levels/:id" component={EditLevel} />
      <Route path="/admin/class/new" component={AddClass} />
      <Route path="/admin/class/:classId" component={EditClass} />
      <Route path="/admin/students" component={AdminStudents} />
      <Route path="/admin/instructors" component={AdminTeachers} />
      <Route path="/admin/user/:id" component={EditUser} />
      <Route path="/admin/schedule" component={AdminSchedule} />
      <Route path="/instructor" component={TeacherView} />
      <Route path="/instructor/edit/:id" component={EditTeacher} />
      <Route path="/style" component={StyleGuide} />
      <Route path="/instructor/class/:id" component={TeacherEditClass} />

      <Route component={PageNotFound} />
    </Switch>
  );
}
