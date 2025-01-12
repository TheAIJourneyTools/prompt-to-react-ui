import { useState, useEffect, useCallback } from 'react';
import * as Babel from '@babel/standalone';
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UseDynamicRendererOptions {
  apiKey?: string;
}

const modelOptions = ['models/gemini-2.0-flash-exp', 'models/gemini-1.5-flash'];
const text1 =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum aliquam sed justo in porttitor. Vestibulum a ante porta, suscipit ipsum volutpat, fermentum lectus. Mauris ut ante lobortis, pharetra ex non, fringilla ipsum. Donec non faucibus lacus, id congue purus. Sed porta accumsan ornare. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin scelerisque est sed vulputate commodo. Morbi dui purus, congue vel pharetra ut, laoreet at est. Vivamus vitae tortor eget sem pharetra imperdiet.';
const text2 = 'Hello world, I love coding';
const systemInstruction = `Please follow these rules:
  1. You will be a text to react component parser.
  2. You will receive a text as input from the user and if this text is not relevant to web design then you will return null.
  3. Your output will be a React component with tailwind classses.
  4. Only return the JSX Elements wrapped in a <div> element, never return something like function Component() { return ... } . Examples:
    . if the user input is "Hello world", you will return a <h1> element with the text "Hello world".
    . if the user input is "I love coding", you will return a <p> element with the text "I love coding".
    . if the user input is I want a banner with a heading "Hello world" and a subheading "I love coding", you will return a <div> element with a <h1> element with the text "Hello world" and a <p> element with the text "I love coding" example:
       jsx
        <div className="bg-gray-100 py-4 px-8">
          <h1 className="text-2xl font-bold mb-2">Hello world</h1>
          <p className="text-gray-700">I love coding</p>
        </div>
  `;

export function useDynamicRenderer({ apiKey }: UseDynamicRendererOptions) {
  const [userInput, setUserInput] = useState(''); // User's input code
  const [Component, setComponent] = useState<React.ComponentType | null>(null); // Rendered component
  const [error, setError] = useState<string | null>(null); // Error message
  const [client, setClient] = useState<GoogleGenerativeAI | null>(null);
  const [generating, setGenerating] = useState(false);
  const [variables, setVariables] = useState({
    var1: '',
    var2: '',
  });

  useEffect(() => {
    if (apiKey) {
      const client = new GoogleGenerativeAI(apiKey);
      setClient(client);
      setVariables({ ...variables, var1: text1, var2: text2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  function cleanResponse(response: string) {
    return response.replace(/```jsx|```/g, '').trim();
  }

  const getPromptResponse = useCallback(async () => {
    if (client) {
      const response = (
        await client
          .getGenerativeModel(
            {
              model: modelOptions[0],
              systemInstruction,
            },
            { apiVersion: 'v1beta' }
          )
          .generateContent({
            contents: [
              {
                role: 'user',
                parts: [{ text: userInput }],
              },
            ],
            generationConfig: { temperature: 0.5 },
          })
      ).response.text();

      return response;
    }
    return null;
  }, [client, userInput]);

  const handleRender = useCallback(async () => {
    setGenerating(true);
    const promptResponse = await getPromptResponse();
    const cleanedResponse = cleanResponse(promptResponse ?? '');
    setError(null);

    try {
      if (promptResponse?.includes('null')) {
        throw new Error('Must be relevant to web design');
      }

      const transformedCode = Babel.transform(
        `
        function Block() {
          return ${cleanedResponse};
        }
        `,
        {
          presets: ['react'],
        }
      ).code;

      const componentFunction = new Function(
        'React',
        `
        ${transformedCode}
        return Block; 
      `
      );

      const EvaluatedComponent = componentFunction(React);
      setComponent(() => EvaluatedComponent);
    } catch (err) {
      setError(`Error: Please refine your prompt ${(err as Error).message}`);
      setComponent(null);
    } finally {
      setGenerating(false);
    }
  }, [getPromptResponse]);

  const handleAddVariableToUserInput = (variable: 'var1' | 'var2') => {
    setUserInput((prev) => prev + variables[variable]);
  };

  return {
    userInput,
    setUserInput,
    Component,
    error,
    generating,
    handleRender,
    handleAddVariableToUserInput,
  };
}
