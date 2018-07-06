import React from 'react';
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

const ErrorValidationElement = ({ field, context }) =>
  context.props.showPopoverError ? (
    <div className="validation-advice">
      <a
        className="dropdown-toggle"
        onClick={() =>
          context.showDetailError && context.showDetailError(field)
        }
        onMouseEnter={() =>
          context.showDetailError && context.showDetailError(field)
        }
        onMouseLeave={() =>
          context.showDetailError && context.showDetailError(field)
        }
        style={{
          display: context.state[field + 'ErrorText'] ? 'block' : 'none'
        }}
      />
      <div
        className="popover"
        style={{
          top: '40px',
          left: '13px',
          display: context.state.showDetailError[field] ? 'block' : 'none'
        }}
      >
        <div className="popover-content">
          {context.state[field + 'ErrorText']}
        </div>
      </div>
    </div>
  ) : (
    ''
  );

const HiddenNumberStyle = {
  width: '1px',
  height: '1px',
  border: 'none',
  background: 'transparent',
  caretColor: 'transparent',
  position: 'absolute',
  outline: 'none',
  top: 0,
  left: 0
};

const NumberWrapper = styled.div`
  position: relative;

  & > input {
    text-align: right;
  }

  & #ccNumberdMasked {
    width: 70%;
    border-radius: 0;
    background-color: #ffffff;
    color: #797979;
    border-width: 0 0 1px;
    border-bottom: solid 1px #d9d9d9;
    padding: 0 11px;
    cursor: pointer;
    line-height: 22px;
    padding-top: 1px;
    padding-bottom: 6px;
    padding-left: 0;
  }

  & > #ccNumberdUnmasked {
    width: 30%;
    text-align: left;
    border-radius: 0;
    background-color: #ffffff;
    color: #797979;
    border-width: 0 0 1px;
    border-bottom: solid 1px #d9d9d9;
    padding: 0 11px;
    cursor: pointer;
    line-height: 22px;
    padding-top: 1px;
    padding-bottom: 6px;
    padding-left: 0;
  }

  & #ccNumber {
    caret-color: transparent;
    position: absolute;
    left: 0;
    opacity: 0;
    width: 100%;
  }
`;

const CIDWrapper = styled.div`
  position: relative;

  & #ccCID {
    caret-color: transparent;
    position: absolute;
    left: 0;
    opacity: 0;
  }
`;

const Label = styled.label`
  cursor: pointer;
`;

export {
  Container,
  FieldWrapper,
  CardImage,
  InputWrapper,
  DangerText,
  FormFieldWrapper,
  FormFieldLabel,
  FormInputWrapper,
  ErrorValidationElement,
  HiddenNumberStyle,
  NumberWrapper,
  CIDWrapper,
  Label
};
