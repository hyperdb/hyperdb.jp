import DefaultLayout from "@/layouts/DefaultLayout";
import Blog from "@/pages/Blog";
import BlogCategory from "@/pages/BlogCategory";
import BlogDetail from "@/pages/BlogDetail";
import BlogTag from "@/pages/BlogTag";
import Contact from "@/pages/Contact";
import Policy from "@/pages/Policy";
import Profile from "@/pages/Profile";
import Home from "@/pages/Home";
import { Route, Switch } from "wouter";
import "./App.css";

function App() {
    return (
        <Switch>
            <Route path="/profile" component={Profile} />
            <Route path="/policy" component={Policy} />
            <Route path="/contact" component={Contact} />
            <Route path="/blog/category/:id" component={BlogCategory} />
            <Route path="/blog/tag/:id" component={BlogTag} />
            <Route path="/blog/:id" component={BlogDetail} />
            <Route path="/blog" component={Blog} />
            <Route path="/" component={Home} />
            <Route>
                <DefaultLayout>404: No such page!</DefaultLayout>
            </Route>
        </Switch>
    );
}

export default App;
