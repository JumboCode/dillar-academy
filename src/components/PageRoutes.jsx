import { Route, Switch } from "wouter";
import Home from '@/pages/Home'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import SignUp from '@/pages/SignUp'
import Login from '@/pages/Login'
import ClassesPage from '@/pages/ClassesPage'
import LevelsPage from '@/pages/LevelsPage'
import StyleGuide from "@/pages/StyleGuide";
import StudentPortal from '@/pages/dashboards/StudentPortal'
import AdminView from '@/pages/dashboards/AdminView'
import TeacherView from '@/pages/dashboards/TeacherView'
import PageNotFound from '@/pages/PageNotFound'

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
      <Route path="/style" component={StyleGuide} />
      <Route path="/student" component={StudentPortal} />
      <Route path="/admin" component={AdminView} />
      <Route path="/teacher" component={TeacherView} />
      <Route component={PageNotFound} />
    </Switch>
  );
};