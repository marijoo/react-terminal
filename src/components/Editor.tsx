import * as React from "react";
import { StyleContext } from "../contexts/StyleContext";
import { TerminalContext } from "../contexts/TerminalContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useCurrentLine, useScrollToBottom } from "../hooks/editor";

export default function Editor(props: any) {
  const wrapperRef = React.useRef(null);
  const style = React.useContext(StyleContext);
  const themeStyles = React.useContext(ThemeContext);
  const { bufferedContent } = React.useContext(TerminalContext);

  useScrollToBottom(bufferedContent, wrapperRef);

  const {
    enableInput,
    caret,
    consoleFocused,
    prompt,
    commands,
    welcomeMessage,
    errorMessage,
    showControlBar,
    defaultHandler
  } = props;

  const currentLine = useCurrentLine(
    caret,
    consoleFocused,
    prompt,
    commands,
    errorMessage,
    enableInput,
    defaultHandler,
    wrapperRef
  );

  return (
    <div id={"terminalEditor"} ref={wrapperRef} className={`${style.editor} ${!showControlBar ? style.curvedTop : null} ${showControlBar ? style.editorWithTopBar : null}`} style={{ background: themeStyles.themeBGColor }}>
      {welcomeMessage}
      {bufferedContent}
      {currentLine}
    </div>
  );
}
