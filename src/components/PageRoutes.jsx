import { Route } from "wouter";
import Home from '@/pages/Home'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import SignUp from '@/pages/SignUp'
import Login from '@/pages/Login'

export default function PageRoutes() {
  return (
    <div>
      <Route path="/" component={Home} />
      <Route path="/About" component={About} />
      <Route path="/Contact" component={Contact} />
      <Route path="/SignUp" component={SignUp} />
      <Route path="/Login" component={Login} />
    </div>
  );
};