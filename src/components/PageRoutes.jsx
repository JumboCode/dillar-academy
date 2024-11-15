import { Route, Switch } from "wouter";
import Home from '@/pages/Home'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import SignUp from '@/pages/SignUp'
import Login from '@/pages/Login'
import Classes from '@/pages/Classes'
import Levels from '@/pages/Levels'
import StyleGuide from "@/pages/StyleGuide";
import Welcome from "../pages/Welcome";

// TODO (John & Frank): add routes for Page Not Found and student and admin pages
export default function PageRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/levels" component={Levels} />
      <Route path="/classes" component={Classes} />
      <Route path="/style" component={StyleGuide} />
      <Route path="/welcome" component={Welcome} />
    </Switch>
  );
};