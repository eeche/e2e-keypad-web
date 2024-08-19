"use client";

import {useEffect, useState, useCallback} from 'react';
import axios from "axios";
import {JSEncrypt} from "jsencrypt";

async function loadPublicKey() {
  try {
    const response = await fetch('/public_key.pem');
    return await response.text();
  } catch (error) {
    console.error('Failed to load public key:', error);
    return null;
  }
}

export default function useSecureKeypad() {
  const [keypad, setKeypad] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    async function initialize() {
      const key = await loadPublicKey();
      setPublicKey(key);
      getSecureKeypad();
    }
    initialize();
  }, []);

  const getSecureKeypad = useCallback(async () => {
    try {
      const response = await axios.get('/api/keypad');
      console.log("Received keypad data:", response.data);
      setKeypad(response.data);

    } catch (error) {
      console.error("Error fetching keypad:", error);
    }
  }, []);
  
  const onKeyPressed = useCallback((hash) => {
    if (hash) {  // hash가 유효한 값인 경우에만 처리
      console.log(`Button with hash ${hash} clicked`);
      setUserInput(prev => {
        const newInput = [...(prev || []), hash]  // prev가 null이나 undefined일 경우 빈 배열 사용
        if (newInput.length == 6) {
          alert(`입력된 값: ${newInput.join(', ')}`);
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
        return newInput;
      });
    } else {
      console.warn('Clicked button has no hash value');
    }
  }, []);

  const resetUserInput = useCallback(() => {
    setUserInput([]);
  }, []);

  const sendUserInput = useCallback(async () => {
    if (!publicKey) {
      console.error("Public key not available");
      return;
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedData = encrypt.encrypt(userInput.join(','));

    try {
      const response = await axios.post('/api/verify', {
        encryptedData: encryptedData
      });
      console.log("Server response:", response.data);
      alert("입력이 성공적으로 전송되었습니다.");
      resetUserInput();
    } catch (error) {
      console.error("Error sending encrypted data:", error);
      alert("입력 전송 중 오류가 발생했습니다.");
    }
  }, [publicKey, resetUserInput, userInput]);

  return {
    states: {
      keypad,
      userInput,
    },
    actions: {
      getSecureKeypad,
      onKeyPressed,
      resetUserInput,
      sendUserInput
    }
  }
}
