import { Route, Switch } from "wouter";
import Home from '@/pages/Home'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import SignUp from '@/pages/SignUp'
import Login from '@/pages/Login'
import Classes from '@/pages/Classes'
import StyleGuide from "@/pages/StyleGuide";

export default function PageRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/classes" component={Classes} />
      <Route path="/style" component={StyleGuide} />
      <Route>Page not found</Route>
    </Switch>
  );
};