import React from 'react';
import App from "./src/App";
import styled, {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
  }
`

const ColorBackground = styled.div`
  background: linear-gradient(122deg, rgba(191,38,94,1) 0%, rgb(255,171,64) 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
`

const RenderContent = ({params, children}) => {
  if(params.env === 'dev') {
    return <div>
      <GlobalStyle />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300&family=Poppins:wght@300;500&display=swap&family=Source+Code+Pro:wght@1;300"
        rel="stylesheet" />
      <ColorBackground>{children}</ColorBackground>
    </div>
  }

  if (params.bg) {
    return <ColorBackground>{children}</ColorBackground>
  }

  return children;
}

export default ({params}) => <RenderContent params={params}>
  <App />
</RenderContent>
