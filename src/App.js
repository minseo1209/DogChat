import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Choose from './page/choose.js';
import MainPage from './page/MainPage.js';
import { Navbar, Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function App() {
  let [sky, setSky] = useState(1);
  let [time, setTime] = useState(new Date());

  useEffect(() => {
    // 배경 시간대 조건

    let updateBackground = () => {
      let hours = time.getHours();

      if (hours >= 6 && hours < 18) {
        setSky(1);
      } else if (hours >= 18 && hours < 19) {
        setSky(2);
      } else if (hours >= 19 && hours <= 23) {
        setSky(3);
      } else {
        setSky(4);
      }
    };
    // 시간 가져오기
    let update = setInterval(() => {
      setTime(new Date());
      updateBackground();
    }, 1000);
    return () => clearInterval(update);
  }, [time]);

  // choose에서 값 가져오기

  let [choose, setChoose] = useState();
  let [nickname, setNickname] = useState();
  // Choose 컴포넌트에서 선택한 옵션을 받아오는 콜백 함수
  let pick = (option, nickname) => {
    setChoose(option);
    setNickname(nickname);
    console.log(Choose);
  };
  return (
    <Router>
      <div
        className="App"
        style={{
          display: 'flex',
          height: '100vh',
          backgroundImage: `url(/img/${sky}.png)`,
        }}
      >
        <Navbar bg="light" expand="lg" className="flex-column">
          <Navbar.Brand href="/">
            <img className="멍챗" src="./img/Logo.png" alt="로고" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="flex-column">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="https://minseoportfolio.netlify.app/">
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
          <Route path="/" element={<Choose onOptionSelect={pick} />} />
          <Route
            path="/main"
            element={
              choose && <MainPage selectedOption={choose} nickname={nickname} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
