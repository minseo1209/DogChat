import React, { useEffect, useState, useRef } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, MessageInput, MessageList } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

let MainPage = (props) => {
  // Props
  let nickname = props.nickname; // 닉네임 프롭스

  // Stream Chat 연동에 필요한 정보
  let apiKey = 'yssedu3g6gsr';
  let authDomain = 'https://mydogchat.netlify.app/';

  // 상태 변수들
  let [client, setClient] = useState(null); // Stream Chat 클라이언트
  let [channel, setChannel] = useState(); // 현재 사용 중인 채널
  let [view, setView] = useState(window.innerHeight); // 화면 높이
  let [messages, setMessages] = useState([]); // 채팅 메시지들
  let printRef = useRef(null); // 채팅 출력창 참조

  // Stream Chat 클라이언트 초기화
  useEffect(() => {
    let initializeChat = async () => {
      try {
        let chatClient = new StreamChat(apiKey, { timeout: 10000 });
        await chatClient.connectAnonymousUser();
        setClient(chatClient);
      } catch (error) {
        console.error('Stream Chat에 연결 중 오류 발생:', error);
      }
    };

    initializeChat();
  }, []);

  // 채널 설정
  useEffect(() => {
    let setupChannel = async () => {
      try {
        if (client.user && client.user.anonymous) {
          let hasCreateChannelPermission = client.user.hasPermission(
            'CreateChannel',
            'messaging'
          );

          if (!hasCreateChannelPermission) {
            console.log('익명 사용자는 채널을 생성할 권한이 없습니다.');
            return;
          }

          let channelId = 'public_channel';
          let newChannel = client.channel('messaging', channelId, {});
          await newChannel.watch();
          setChannel(newChannel);
        }
      } catch (error) {
        console.error('Stream Chat 채널 설정 중 오류 발생:', error);
      }
    };

    if (client) {
      setupChannel();
    }
  }, [client]);

  // 화면 높이 변경 감지
  useEffect(() => {
    let handleResize = () => {
      setView(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 메시지 출력창 자동 스크롤
  useEffect(() => {
    if (printRef.current) {
      printRef.current.scrollTop = printRef.current.scrollHeight;
    }
  }, [messages]);

  // 강아지 움직임 관련 상태 변수들
  let [change, setChange] = useState('숨');
  let [walk, setWalk] = useState(0);
  let [left, setLeft] = useState(false);

  // 키보드 입력 이벤트 처리
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

  // 강아지 이동 함수
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

  // 강아지 위치 계산 함수
  let dogBottom = () => {
    let dogSize = 100;
    let worldHeight = view - dogSize;
    let ground = 74;
    return worldHeight - ground;
  };

  // 최대 화면 크기 설정
  let maxView = 80;
  let maxLeft = (window.innerWidth * maxView) / 100;

  // 채팅 입력창과 출력창 관련 상태 변수들
  let [inputText, setInputText] = useState('');

  // 채팅 입력 이벤트 처리
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
      <span
        className="dog-nickname"
        style={{
          position: 'absolute', // 이미지와 함께 움직이기 위해 absolute로 변경
          top: `${dogBottom() - 20}px`, // 강아지 머리 위에 표시하도록 위치 조정
          left: `${Math.min(Math.max(walk, 0), maxLeft) + 20}px`, // 강아지 머리와 같은 위치로 조정
        }}
      >
        {nickname}
      </span>
      {client && channel && (
        <Chat client={client} theme="messaging light">
          <Channel channel={channel}>
            <div className="chat">
              <MessageList />
              <MessageInput />
            </div>
          </Channel>
        </Chat>
      )}

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
              e.preventDefault();
              handleKeyPress(e);
            }
          }}
        />
      </div>
    </div>
  );
};

export default MainPage;
