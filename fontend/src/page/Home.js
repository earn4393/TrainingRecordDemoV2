import React from 'react';
import { Container, Figure } from 'react-bootstrap';
import LOGO from '../image/logo1.webp'
import '../styles/Styles.css'

// หน้าโฮม
const Home = () => {
    return (
        <Container className='wrapp-layout-home'>
            <Figure style={{ overflow: 'hidden' }}>
                <Figure.Image
                    className='content-logo-home'
                    src={LOGO}
                    alt='training record'
                />
                <Figure.Caption>
                    <h3 className='head-title'>ASAIN STANLEY INTERNATIONAL</h3>
                </Figure.Caption>
            </Figure>
        </Container>
    )
}

export default Home;