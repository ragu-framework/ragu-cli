import styled from "styled-components";

export const Codeblock = styled.div`
  box-sizing: border-box;
  background: #2C3332;
  border-radius: 20px;
  padding: 1rem;
  color: white;
  width: 100%;
  overflow: auto;
  font-family: 'Source Code Pro', monospace;
  white-space: nowrap;
  
  .accent {
    color: #db5989;
  }
  
  .secondary {
    color: #ffbf6f;
  }
  
  .third {
    color: #6fff87;  
  }
  
  .link {
    color: #f2f2f2;
    text-decoration: underline;
  }
  
  .comment {
    color: #999999;
  }
`
