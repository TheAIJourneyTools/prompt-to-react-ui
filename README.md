# Dynamic React Component Renderer with Generative AI

This project implements a custom React hook, `useDynamicRenderer`, which leverages generative AI to dynamically generate and render React components based on user input. The hook is built with the following technologies:

- **React** for building the UI and components.
- **@babel/standalone** for compiling JSX dynamically.
- **GoogleGenerativeAI SDK** for generating React components based on user prompts.
- **Tailwind CSS** for styling the components.

---

## Features

- **Dynamic React Component Generation**: Transforms user input into dynamically generated React components.
- **AI-Powered Content Generation**: Uses a generative AI model to interpret user prompts and generate corresponding JSX.
- **Error Handling**: Detects and handles invalid responses or errors during component generation.
- **Customizable Variables**: Includes built-in support for pre-defined variables that can be added to user prompts.

---

## How It Works

### System Instructions to AI
The generative AI is configured with specific rules to convert user inputs into JSX code that adheres to web design principles. For example:

- Input: `Hello world`
  - Output: `<h1 className="text-xl">Hello world</h1>`

- Input: `I want a banner with a heading "Hello world" and a subheading "I love coding"`
  - Output:
    ```jsx
    <div className="bg-gray-100 py-4 px-8">
      <h1 className="text-2xl font-bold mb-2">Hello world</h1>
      <p className="text-gray-700">I love coding</p>
    </div>
    ```

---

## API Reference

### `useDynamicRenderer`
This hook provides all the functionality for generating and rendering components dynamically.

#### Parameters
- `apiKey` (optional): Your Google Generative AI API key.

#### Returns
- `userInput`: The current user input string.
- `setUserInput`: Function to update the user input.
- `Component`: The dynamically rendered React component.
- `error`: Any error message encountered during rendering.
- `generating`: Boolean indicating if the component is being generated.
- `handleRender`: Function to trigger the rendering process.
- `handleAddVariableToUserInput`: Function to append predefined variables (`var1` or `var2`) to the user input.

---

## Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```
   
## Example Usage

```tsx
import React from 'react';
import { useDynamicRenderer } from './useDynamicRenderer';

function App() {
  const {
    userInput,
    setUserInput,
    Component,
    error,
    generating,
    handleRender,
    handleAddVariableToUserInput,
  } = useDynamicRenderer({ apiKey: 'your-api-key-here' });

  return (
    <div>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter your design prompt here"
      />
      <button onClick={handleRender} disabled={generating}>
        Generate Component
      </button>
      <button onClick={() => handleAddVariableToUserInput('var1')}>
        Add Text 1
      </button>
      <button onClick={() => handleAddVariableToUserInput('var2')}>
        Add Text 2
      </button>

      {generating && <p>Generating...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {Component && <Component />}
    </div>
  );
}

export default App;
```

---

## Key Functions

### `handleRender`
Triggers the process of sending the user input to the generative AI and rendering the resulting React component.

### `handleAddVariableToUserInput`
Appends predefined text variables (`var1` or `var2`) to the user input for easier prompt creation.

### Error Handling
If the user input is irrelevant to web design or the AI fails to generate valid JSX, an error is displayed, prompting the user to refine their input.

---

## Notes
- Ensure your Google Generative AI API key is valid and has access to the required models.
- Responses must conform to the JSX format defined in the system instructions to avoid errors.

---

## Future Improvements
- Add support for custom styling options in the user input.
- Enhance validation for more robust JSX output.
- Expand functionality for integrating with additional AI models.

---

## License
This project is open-source and available under the MIT License.

