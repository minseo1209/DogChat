import React, { useEffect, useState, useRef } from 'react';

function MainPage(props) {
  let nickname = props.nickname;

  let [view, setView] = useState(window.innerHeight);
  useEffect(() => {
    let handleResize = () => {
      setView(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 키보드 이벤트
  let [change, setChange] = useState('숨');
  let [walk, setWalk] = useState(0);
  let [left, setLeft] = useState(false);

  useEffect(() => {
    let keyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setChange('걷기');
        move(1);
        setLeft(false);
      } else if (e.key === 'ArrowLeft') {
        setChange('걷기');
        move(-1);
        setLeft(true);
      }
    };

    let keyUp = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setChange('숨');
      }
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, []);

  let move = (direction) => {
    let moveInterval = setInterval(() => {
      setWalk((prev) => prev + direction);
    }, 50);

    let keyUpHandler = () => {
      clearInterval(moveInterval);
      setChange('숨');
    };

    window.addEventListener('keyup', keyUpHandler);

    return () => {
      clearInterval(moveInterval);
      window.removeEventListener('keyup', keyUpHandler);
    };
  };

  let dogBottom = () => {
    let dogSize = 100;
    let worldHeight = view - dogSize;
    let ground = 54;
    return worldHeight - ground;
  };

  // 화면 크기 제한
  let maxView = 80;
  let maxLeft = (window.innerWidth * maxView) / 100;

  // 채팅 입력과 출력을 위한 상태 및 함수 추가
  let [inputText, setInputText] = useState('');
  let [messages, setMessages] = useState([]);

  let handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setMessages((prevMessages) => [
        ...prevMessages,
        { nickname, content: inputText },
      ]);
      setInputText('');
    }
  };
  let printRef = useRef(null);

  // useEffect를 사용하여 스크롤 항상 맨 아래로 이동
  useEffect(() => {
    if (printRef.current) {
      printRef.current.scrollTop = printRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="world">
      <img
        className="dog"
        alt="캐릭터"
        src={`/img/Dog/${change}/${props.selectedOption}.gif`}
        style={{
          top: `${dogBottom()}px`,
          transform: left ? 'scaleX(-1)' : 'scaleX(1)',
          left: `${Math.min(Math.max(walk, 0), maxLeft)}px`,
        }}
      ></img>
      {/*채팅출력창*/}
      <div className="print" ref={printRef}>
        {messages.map((message, index) => (
          <div key={index} className="chat-message">
            <span className="name">{message.nickname}:</span> {message.content}
          </div>
        ))}
      </div>
      <div className="chat">
        <input
          className="chatBox"
          type="text"
          placeholder="채팅을 입력해주세요."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // 엔터 키에 의한 폼 제출 방지
              handleKeyPress(e);
            }
          }}
        />
      </div>
    </div>
  );
}

export default MainPage;
