'use client';

import React from 'react';
import UserInput from './UserInput';
import { useDynamicRenderer } from '@/hooks/useDynamicRenderer';

export default function DynamicRender({ apiKey }: { apiKey?: string }) {
  const {
    userInput,
    setUserInput,
    Component,
    error,
    generating,
    handleRender,
    handleAddVariableToUserInput,
  } = useDynamicRenderer({ apiKey });

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold mb-4'>
        Dynamic React Component Renderer
      </h1>
      <div id='variables' className='flex gap-2'>
        <button
          onClick={() => handleAddVariableToUserInput('var1')}
          className='px-4 py-2 mt-2 bg-blue-500 text-white rounded'
        >
          Add var1
        </button>
        <button
          onClick={() => handleAddVariableToUserInput('var2')}
          className='px-4 py-2 mt-2 bg-blue-500 text-white rounded'
        >
          Add var2
        </button>
      </div>
      <UserInput userInput={userInput} setUserInput={setUserInput} /> <br />
      <button
        onClick={handleRender}
        className='px-4 py-2 mt-2 bg-blue-500 text-white rounded'
      >
        Render Component
      </button>
      <div className='mt-5'>
        {generating && <div className='text-blue-500'>Generating...</div>}
        {error && <div className='text-red-500'>{error}</div>}
        {!error && Component && React.createElement(Component)}
      </div>
    </div>
  );
}
