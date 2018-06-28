import styled from 'styled-components';

const Container = styled.div`
  display: inline-block;
  ${({ styled }) => ({ ...styled })};
`;
const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background-color: white;
  padding: 10px;
  border-radius: 3px;
  overflow: hidden;
  ${({ styled }) => ({ ...styled })};

  &.is-invalid {
    border: 1px solid #ff3860;
    ${({ invalidStyled }) => ({ ...invalidStyled })};
  }

  span {
    width: 33%;
  }
`;

const FormFieldWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background-color: transparent;
  padding: 0;
  border-radius: 3px;
  overflow: hidden;
  ${({ styled }) => ({ ...styled })};

  &.is-invalid {
    border: 1px solid #ff3860;
    ${({ invalidStyled }) => ({ ...invalidStyled })};
  }

  span {
    width: 33%;
  }
`;
const FormFieldLabel = styled.span`
  padding: 0 10px;
`;
const CardImage = styled.img`
  height: 1em;
  ${({ styled }) => ({ ...styled })};
`;
const InputWrapper = styled.label`
  position: relative;
  margin-left: 0.5em;
  display: flex;
  align-items: center;
  transition: transform 0.5s;
  transform: translateX(
    ${({ translateXForZip }) => (translateXForZip ? '0' : '4rem')}
  );

  &::after {
    content: attr(data-max);
    visibility: hidden;
    height: 0;
  }

  & .credit-card-input {
    border: 0px;
    position: absolute;
    width: 100%;
    font-size: 1em;
    ${({ inputStyled }) => ({ ...inputStyled })};

    &:focus {
      outline: 0px;
    }
  }

  & .zip-input {
    display: ${({ translateXForZip }) => (translateXForZip ? 'flex' : 'none')};
  }
`;
const FormInputWrapper = styled.label`
  position: relative;
  display: block;
  padding: 10px;
  background-color: white;
  width: 67%;
  align-items: center;
  transition: transform 0.5s;
  transform: translateX(
    ${({ translateXForZip }) => (translateXForZip ? '0' : '4rem')}
  );

  &::after {
    content: attr(data-max);
    visibility: hidden;
    height: 0;
  }

  & .credit-card-input {
    border: 0px;
    position: absolute;
    width: 94%;
    font-size: 1em;
    ${({ inputStyled }) => ({ ...inputStyled })};

    &:focus {
      outline: 0px;
    }
  }

  & .zip-input {
    display: ${({ translateXForZip }) => (translateXForZip ? 'flex' : 'none')};
  }
`;
const DangerText = styled.p`
  font-size: 0.8rem;
  margin: 2.5px 10px;
  color: #ff3860;
  ${({ styled }) => ({ ...styled })};
`;

export {
  Container,
  FieldWrapper,
  CardImage,
  InputWrapper,
  DangerText,
  FormFieldWrapper,
  FormFieldLabel,
  FormInputWrapper
};
