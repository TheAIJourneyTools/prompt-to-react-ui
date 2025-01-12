import React from 'react';

interface UserInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ userInput, setUserInput }) => {
  return (
    <textarea
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      placeholder={`I want a banner with a heading "Hello world" and a subheading "I love coding"`}
      className='w-full h-36 font-mono text-sm mb-2 p-2 border rounded'
    />
  );
};

export default UserInput;
