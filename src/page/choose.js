import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Choose({ onOptionSelect }) {
  let navigate = useNavigate();

  let handleClick = (color) => {
    // onOptionSelect이 함수일 경우에만 호출
    if (typeof onOptionSelect === 'function') {
      onOptionSelect(color, nickname);
      console.log('Nickname:', nickname);
      navigate('/main');
    }
  };

  let [nickname, setNickname] = useState();

  let handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  return (
    <div className="btn-center">
      <div>
        <input
          className="nickname"
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임을 입력하세요"
        />
      </div>
      <button
        className="btnstyle"
        onClick={() => handleClick('검정')}
        style={{ marginRight: '2rem', textAlign: 'center' }}
      >
        <img src="/img/Dog/쉬다/검정.png" alt="검정"></img>
      </button>
      <button className="btnstyle" onClick={() => handleClick('갈색')}>
        <img src="/img/Dog/쉬다/갈색.png" alt="갈색"></img>
      </button>
      <div>
        <h4>당신의 강아지를 선택해주세요</h4>
      </div>
    </div>
  );
}

export default Choose;
