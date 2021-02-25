import styled, {keyframes} from "styled-components";
import React from "react";

const leftToRightAnimation = (width = 60) => keyframes`
  from {
    width: 0;
    opacity: 1;
  }

  to {
    opacity: 1;
    width: ${width}%;
  }
`;

const rightToLeftAnimation = (width = 60) => keyframes`
  from {
    opacity: 1;
    width: 0;
    margin-left: 100%;
  }

  to {
    opacity: 1;
    margin-left: ${100 - width}%;
    width: ${width}%;
  }
`;

const showContentAnimation = keyframes`
  0% { opacity:0; }
  33% { opacity:0; }
  100% { opacity:1; }
`;

const CardTitleSection = styled.div`
  display: flex;
  align-items: center;
`;

const CardTitle = styled.div`
  font-family: Poppins, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 1.125rem;
  line-height: 27px;
`;

const CardCounter = styled.span`
  font-family: Poppins, sans-serif;
  font-weight: bold;
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: block;
  line-height: 40px;
  text-align: center;
  border-radius: 40px;
  background: #BF265E;
  color: white;
  font-size: 0.75rem;
  margin-right: 1.25rem;
`

const CardWrapper = styled.section`
  position: relative;
  font-family: Poppins, sans-serif;
  font-size: .875rem;
  font-weight: 300;
  box-sizing: border-box;
  background: white;
  padding: 4rem;
  display: flex;
  align-items: center;
  min-height: 350px;
  opacity: 0;
  overflow: hidden;

  &.visible {
    animation: 1s ease 0s normal forwards 1 ${(props) => props.direction === 'left' ? leftToRightAnimation() : rightToLeftAnimation()};
    
    @media (max-width: 1024px) {
      animation: 1s ease 0s normal forwards 1 ${(props) => props.direction === 'left' ? leftToRightAnimation(90) : rightToLeftAnimation(90)};

      > * {
        max-width: 100%;
      }
    }  
  }
  margin-left: ${(props) => props.direction === 'left' ? '0' : '40%'};
  border-radius: ${(props) => props.direction === 'left' ? '0 200px 200px 0' : '200px 0 0 200px'};
  flex-direction: ${(props) => props.direction === 'left' ? 'row-reverse' : 'row'};
  
  > * {
    max-width: 80%;
    opacity: 0;
    animation: 2s ease 0s normal forwards 1 ${showContentAnimation};
  }
`;

const CardContent = styled.div`
  display: grid;
  grid-gap: 1rem;

  p {
    margin: 0;
  }
`

const DetailImage = styled.img`
  position: absolute;
  right: -5%;
  width: 20%;
  top: 50%;

  transform: translate(-50%, -50%);
  
  @media (max-width: 750px) {
    right: 6%;
    top: 40%;
    width: 10%;
  }
`;

export const Card = ({step, title, image, children, description, visible}) => <CardWrapper
  direction={step % 2 === 0 ? 'right' : 'left'}
  className={visible ? 'visible' : ''}
>
  <CardContent>
    {image && <DetailImage src={image} alt={title} />}
    <CardTitleSection>
      <CardCounter>{step}</CardCounter>
      <CardTitle>{title}</CardTitle>
    </CardTitleSection>
    {children}
    <p>{description}</p>
  </CardContent>
</CardWrapper>

export const CardGrid = styled.div`
  display: grid;
  grid-gap: 4rem;
`
