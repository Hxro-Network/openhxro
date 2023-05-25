import React from 'react';
import Header from '../../components/Header';
import ContentPage from '../../components/ContentPage';
import Footer from '../../components/Footer';
import { Container } from './Home.style';

const Home = () => {
  return (
    <Container>
      <Header />
      <ContentPage />
      <Footer />
    </Container>
  );
};

export default Home;
