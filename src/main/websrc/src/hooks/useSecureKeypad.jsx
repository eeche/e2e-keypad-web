"use client";

import {useMemo, useState, useCallback} from 'react';
import axios from "axios";
import {JSEncrypt} from "jsencrypt";

export default function useSecureKeypad() {
  const [keypad, setKeypad] = useState(null);
  const [userInput, setUserInput] = useState([]);

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

  return {
    states: {
      keypad,
      userInput,
    },
    actions: {
      getSecureKeypad,
      onKeyPressed,
      resetUserInput
    }
  }
}
