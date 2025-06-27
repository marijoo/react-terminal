# react-terminal

🖥 React component that renders a Terminal. Heavily based on the package by [bony2023](https://github.com/bony2023/react-terminal).

## Looking for Sponsors/Contributors
While my time is restricted, I'm still committed to this library. To help focus development, sponsorship is appreciated for urgent feature requests. I strongly encourage community contributions through pull requests. Feel free to submit them for any issues or new features, and I'll be happy to review them. Thank you!

## Features

- Mobile support. 📱
- Customizable commands, prompt and error message. ✅
- Support callbacks(async/non-async) for commands. 🔄
- Command history using arrow up and down. 🔼
- Support for copy/paste. 📋
- In-built themes and support to create more. 🚀

## Installation

Install package with NPM or YARN and add it to your development dependencies:

```sh
npm install react-terminal
```

## Usage

```js
import { ReactTerminal } from "react-terminal";

function MyComponent(props) {
  const commands = {
    whoami: "jackharper",
    cd: (directory) => `changed path to ${directory}`,
  };

  return <ReactTerminal commands={commands} />;
}
```

Also make sure to wrap the main mountpoint around the `TerminalContextProvider`. This retains the state even when the component is unmounted and then mounted back:

```tsx
import { TerminalContextProvider } from "react-terminal";

ReactDOM.render(
  <TerminalContextProvider>
    <App />
  </TerminalContextProvider>,
  rootElement,
);
```

## Creating custom themes

```tsx
<ReactTerminal
  commands={commands}
  themes={{
    "my-custom-theme": {
      themeBGColor: "#272B36",
      themeToolbarColor: "#DBDBDB",
      themeColor: "#FFFEFC",
      themePromptColor: "#a917a8"
    }
  }}
theme="my-custom-theme"
/>
```

## Props
| name | description | default
|--|--|--
| `welcomeMessage` | A welcome message to show at the start, before the prompt begins. Value can be either a string or JSX | null
| `prompt` | Terminal prompt | >>>
| `commands` | List of commands to be provided as a key value pair where value can be either a string, JSX/HTML tag or callback | null
| `errorMessage` | Message to show when unidentified command executed, can be either a string, JSX/HTML tag or callback | "not found!"
| `enableInput` | Whether to enable user input | true
| `showControlBar` | Whether to show the top control bar | true
| `showControlButtons` | Whether to show the control buttons at the top bar of the terminal | true
| `theme` | Theme of the terminal | "light"
| `themes` | Themes object to supply custom themes | null
| `defaultHandler` | Default handler to be used (if provided) when no commands match. Useful when you don't know list of commands beforehand/want to send them to server for handling. | null

## In-built commands

| command | description        |
| ------- | ------------------ |
| `clear` | Clears the console |
