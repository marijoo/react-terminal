import React, { useContext, useEffect } from "react";
import { isMobile } from "react-device-detect";

import { StyleContext } from "../contexts/StyleContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { TerminalContext } from "../contexts/TerminalContext";

export const useEditorInput = (
  consoleFocused: boolean,
  editorInput: string,
  setEditorInput: any,
  setProcessCurrentLine: any,
  enableInput: boolean,
) => {
  const { getPreviousCommand, getNextCommand } = useContext(TerminalContext);

  const handleKeyDownEvent = (event: any) => {
    if (!consoleFocused) {
      return;
    }

    if (!enableInput) {
      return;
    }

    event.preventDefault();

    const eventKey = event.key;

    if (eventKey === "Enter") {
      setProcessCurrentLine(true);
      return;
    }

    let nextInput = null;

    if (eventKey === "Backspace") {
      nextInput = editorInput.slice(0, -1);
    } else if (eventKey === "ArrowUp") {
      nextInput = getPreviousCommand();
    } else if (eventKey === "ArrowDown") {
      nextInput = getNextCommand();
    } else {
      nextInput =
        eventKey && eventKey.length === 1
          ? editorInput + eventKey
          : editorInput;
    }

    setEditorInput(nextInput);
    setProcessCurrentLine(false);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDownEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyDownEvent);
    };
  });
};

export const useBufferedContent = (
  processCurrentLine: any,
  setProcessCurrentLine: any,
  prompt: string,
  currentText: any,
  setCurrentText: any,
  commands: any,
  errorMessage: any,
) => {
  const { bufferedContent, setBufferedContent } = useContext(TerminalContext);
  const style = React.useContext(StyleContext);
  const themeStyles = React.useContext(ThemeContext);

  useEffect(() => {
    if (!processCurrentLine) {
      return;
    }

    const processCommand = async (text: string) => {
      const [command, ...rest] = text.trim().split(" ");
      let output = "";

      if (command === "clear") {
        setBufferedContent("");
        setCurrentText("");
        setProcessCurrentLine(false);
        return;
      }

      const waiting = (
        <>
          {bufferedContent}
          <span style={{ color: themeStyles.promptColor }}>{prompt}</span>
          <span className={`${style.lineText} ${style.preWhiteSpace}`}>
            {currentText}
          </span>
          <br />
        </>
      );
      setBufferedContent(waiting);
      setCurrentText("");

      if (text) {
        const commandArguments = rest.join(" ");

        if (command && commands[command]) {
          const executor = commands[command];

          if (typeof executor === "function") {
            output = await executor(commandArguments);
          } else {
            output = executor;
          }
        } else if (typeof errorMessage === "function") {
          output = await errorMessage(commandArguments);
        } else {
          output = errorMessage;
        }
      }

      const nextBufferedContent = (
        <>
          {bufferedContent}
          <span style={{ color: themeStyles.promptColor }}>{prompt}</span>
          <span className={`${style.lineText} ${style.preWhiteSpace}`}>
            {currentText}
          </span>
          {output ? (
            <span>
              <br />
              {output}
            </span>
          ) : null}
          <br />
        </>
      );

      setBufferedContent(nextBufferedContent);
      setProcessCurrentLine(false);
    };

    processCommand(currentText);
  }, [processCurrentLine]);
};

export const useCurrentLine = (
  caret: boolean,
  consoleFocused: boolean,
  prompt: string,
  commands: any,
  errorMessage: any,
  enableInput: boolean,
) => {
  const style = React.useContext(StyleContext);
  const themeStyles = React.useContext(ThemeContext);
  const { appendCommandToHistory } = React.useContext(TerminalContext);
  const mobileInputRef = React.useRef(null);
  const [editorInput, setEditorInput] = React.useState("");
  const [processCurrentLine, setProcessCurrentLine] = React.useState(false);

  React.useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (consoleFocused) {
      mobileInputRef.current.focus();
    }
  }, [consoleFocused]);

  React.useEffect(() => {
    if (!processCurrentLine) {
      return;
    }
    appendCommandToHistory(editorInput);
  }, [processCurrentLine]);

  const mobileInput =
    isMobile && enableInput ? (
      <div className={style.mobileInput}>
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          value={editorInput}
          onChange={(event) => setEditorInput(event.target.value)}
          ref={mobileInputRef}
        />
      </div>
    ) : null;

  const currentLine = !processCurrentLine ? (
    <>
      {mobileInput}
      <span style={{ color: themeStyles.promptColor }}>{prompt}</span>
      <div className={style.lineText}>
        <span className={style.preWhiteSpace}>{editorInput}</span>
        {consoleFocused && caret ? (
          <span className={style.caret}>
            <span className={style.caretAfter} />
          </span>
        ) : null}
      </div>
    </>
  ) : (
    <>
      {mobileInput}
      <div className={style.lineText}>
        {consoleFocused && caret ? (
          <span className={style.caret}>
            <span
              className={style.caretAfter}
              style={{ background: themeStyles.color }}
            />
          </span>
        ) : null}
      </div>
    </>
  );

  useEditorInput(
    consoleFocused,
    editorInput,
    setEditorInput,
    setProcessCurrentLine,
    enableInput,
  );

  useBufferedContent(
    processCurrentLine,
    setProcessCurrentLine,
    prompt,
    editorInput,
    setEditorInput,
    commands,
    errorMessage,
  );

  return currentLine;
};

export const useScrollToBottom = (changesToWatch: any, wrapperRef: any) => {
  React.useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
  }, [changesToWatch]);
};
