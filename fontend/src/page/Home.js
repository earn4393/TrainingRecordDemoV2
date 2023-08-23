import React from 'react';
import { Container, Figure } from 'react-bootstrap';
import LOGO from '../image/logo1.png'
import '../styles/Styles.css'



const Home = () => {

    return (
        <Container className='wrapp-layout-home'>
            <Figure style={{ overflow: 'hidden' }}>
                <Figure.Image
                    className='content-logo-home'
                    src={LOGO}
                />
                <Figure.Caption>
                    <h3 className='head-title-home'>ASAIN STANLEY INTERNATIONAL</h3>
                </Figure.Caption>
            </Figure>
        </Container>

    )
}

export default Home;