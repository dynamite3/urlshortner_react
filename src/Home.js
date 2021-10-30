import {  Card, Col, Container, Row } from 'react-bootstrap';
import { Image } from 'react-bootstrap';

export function Home() {
  return (
    <div>
        <Container>
            <Row id="homr1">
                <Col sm={12} md={12} lg={6} xl={6}  className="hleft">
                <Image src="https://miro.medium.com/max/830/1*Pdw7h5X6vQQNVopIzHBG6A.jpeg" fluid />
                   
                </Col>

                <Col sm={12} md={12} lg={6} xl={6} className="hright">
                   <h1>Steps :</h1>
                   <h3>1 . Create account </h3>
                   <h3>2 . Login to your account </h3>
                   <h3>3 . Enter the long-URL you want to short  </h3>
                   <h3>4 . Enjoy your short url</h3>
                </Col>
            </Row>
        </Container>


    </div>
  );
}
