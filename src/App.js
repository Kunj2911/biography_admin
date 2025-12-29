import './App.css';
import { BrowserRouter, Routes, Route , Navigate } from 'react-router-dom';
import PrivateComponent from './components/PrivateComponent';
import Layout from './components/Layout';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Category from './components/Category';
import AddCategory from './components/AddCategory';
import Person from './components/AddPerson';
import PersonList from './components/PersonList';
import Setting from './components/Setting';
import Banner from './components/Banner';
import BannerList from './components/BannerList';
import UpdateBanner from './components/UpdateBanner';
import UpdatePerson from './components/UpdatePerson';
import UpdateCategories from './components/UpdateCategories';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Private pages (with navbar inside Layout) */}
         
        <Route element={<PrivateComponent />}>
          <Route
            path="/"
            element={
              <Layout>
                <Category />
              </Layout>
            }
          />
          <Route
            path="/add category"
            element={
              <Layout>
                <AddCategory />
              </Layout>
            }
          />
          <Route
            path="/personlist"
            element={
              <Layout>
                <PersonList />
              </Layout>
            }
          />
          <Route
            path="/add person"
            element={
              <Layout>
                <Person />
              </Layout>
            }
          />
          <Route
            path="/setting"
            element={
              <Layout>
                <Setting />
              </Layout>
            }
          />
          <Route
            path="/banner"
            element={
              <Layout>
                <Banner />
              </Layout>
            }
          />
          <Route
            path="/bannerlist"
            element={
              <Layout>
                <BannerList />
              </Layout>
            }
          />
          <Route
            path="/update-banner/:id"
            element={
              <Layout>
                <UpdateBanner />
              </Layout>
            }
          />
          <Route
            path="/update/:id"
            element={
              <Layout>
                <UpdatePerson />
              </Layout>
            }
          />
          <Route
            path="/update-category/:id"
            element={
              <Layout>
                <UpdateCategories />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
