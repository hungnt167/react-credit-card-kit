// @flow

import React, { Component, Fragment } from 'react';
import payment from 'payment';
import creditCardType from 'credit-card-type';
import styled from 'styled-components';
import isValidZip from 'is-valid-zip';

import {
  formatCardNumber,
  formatExpiry,
  hasCardNumberReachedMaxLength,
  hasCVCReachedMaxLength,
  hasZipReachedMaxLength,
  isHighlighted
} from './utils/formatter';
import images from './utils/images';
import isExpiryInvalid from './utils/is-expiry-invalid';

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

const FormFieldWrapper: FieldWrapper = styled.div`
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
  display: flex;
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
    flex-shrink: 0;
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
const DangerText = styled.p`
  font-size: 0.8rem;
  margin: 2.5px 10px;
  color: #ff3860;
  ${({ styled }) => ({ ...styled })};
`;

const BACKSPACE_KEY_CODE = 8;
const CARD_TYPES = {
  mastercard: 'MASTERCARD',
  visa: 'VISA',
  amex: 'AMERICAN_EXPRESS'
};

type Props = {
  cardCVCInputRenderer: Function,
  cardExpiryInputRenderer: Function,
  cardNumberInputRenderer: Function,
  cardZipInputRenderer: Function,
  afterValidateCard: Function,
  cardExpiryInputProps: Object,
  cardNumberInputProps: Object,
  cardCVCInputProps: Object,
  cardZipInputProps: Object,
  cardImageClassName: string,
  cardImageStyle: Object,
  containerClassName: string,
  containerStyle: Object,
  dangerTextClassName: string,
  dangerTextStyle: Object,
  fieldClassName: string,
  fieldStyle: Object,
  enableZipInput: boolean,
  inputComponent: Function | Object | string,
  inputClassName: string,
  inputStyle: Object,
  invalidClassName: string,
  invalidStyle: Object,
  translator: Object
};
type State = {
  cardImage: string,
  cardNumberLength: number,
  cardNumber: ?string,
  errorText: ?string,
  showZip: boolean,
  ccNumberErrorText: string,
  ccExpDateErrorText: string,
  ccCIDErrorText: string,
  ccZipErrorText: string
};

const inputRenderer = ({ props }: Object) => <input {...props} />;

class CreditCardInput extends Component<Props, State> {
  cardExpiryField: any;
  cardNameField: any;
  cardNumberField: any;
  cvcField: any;
  zipField: any;

  static defaultProps = {
    cardCVCInputRenderer: inputRenderer,
    cardExpiryInputRenderer: inputRenderer,
    cardNumberInputRenderer: inputRenderer,
    cardZipInputRenderer: inputRenderer,
    afterValidateCard: () => {},
    cardExpiryInputProps: {},
    cardNumberInputProps: {},
    cardCVCInputProps: {},
    cardZipInputProps: {},
    cardImageClassName: '',
    cardImageStyle: {},
    containerClassName: '',
    containerStyle: {},
    dangerTextClassName: '',
    dangerTextStyle: {},
    enableZipInput: false,
    fieldClassName: '',
    fieldStyle: {},
    inputComponent: 'input',
    inputClassName: '',
    inputStyle: {},
    invalidClassName: 'is-invalid',
    invalidStyle: {},
    translator: {}
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      cardImage: images.placeholder,
      cardNumberLength: 0,
      cardNumber: null,
      errorText: null,
      showZip: false,
      ccNumberErrorText: null,
      ccExpDateErrorText: null,
      ccCIDErrorText: null,
      ccZipErrorText: null
    };
  }

  componentDidMount = () => {
    this.setState({ cardNumber: this.cardNumberField.value }, () => {
      const cardType = payment.fns.cardType(this.state.cardNumber);
      this.setState({
        cardImage: images[cardType] || images.placeholder
      });
    });
  };

  checkIsNumeric = (e: any) => {
    if (!/^\d*$/.test(e.key)) {
      e.preventDefault();
    }
  };

  handleCardNumberBlur = (
    { onBlur }: { onBlur?: ?Function } = { onBlur: null }
  ) => (e: SyntheticInputEvent<*>) => {
    if (!payment.fns.validateCardNumber(e.target.value)) {
      this.setFieldInvalid('Card number is invalid', {
        state: 'ccNumberErrorText'
      });
    }

    const { cardNumberInputProps } = this.props;
    cardNumberInputProps.onBlur && cardNumberInputProps.onBlur(e);
    onBlur && onBlur(e);
  };

  handleCardNumberChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    const cardNumber = e.target.value;
    const cardNumberLength = cardNumber.split(' ').join('').length;
    const cardType = payment.fns.cardType(cardNumber);
    const cardTypeInfo =
      creditCardType.getTypeInfo(creditCardType.types[CARD_TYPES[cardType]]) ||
      {};
    const cardTypeLengths = cardTypeInfo.lengths || [16];

    this.cardNumberField.value = formatCardNumber(cardNumber);

    this.setState({
      cardImage: images[cardType] || images.placeholder,
      cardNumber
    });

    this.setState({ showZip: cardNumberLength >= 6 });

    this.setFieldValid({ state: 'ccNumberErrorText' });
    if (cardTypeLengths) {
      const lastCardTypeLength = cardTypeLengths[cardTypeLengths.length - 1];
      for (let length of cardTypeLengths) {
        if (
          length === cardNumberLength &&
          payment.fns.validateCardNumber(cardNumber)
        ) {
          this.cardExpiryField.focus();
          break;
        }
        if (cardNumberLength === lastCardTypeLength) {
          this.setFieldInvalid('Card number is invalid', {
            state: 'ccNumberErrorText'
          });
        }
      }
    }

    const { cardNumberInputProps } = this.props;
    cardNumberInputProps.onChange && cardNumberInputProps.onChange(e);
    onChange && onChange(e);
  };

  handleCardNumberKeyPress = (e: any) => {
    const value = e.target.value;
    this.checkIsNumeric(e);
    if (value && !isHighlighted()) {
      const valueLength = value.split(' ').join('').length;
      if (hasCardNumberReachedMaxLength(value, valueLength)) {
        e.preventDefault();
      }
    }
  };

  handleCardExpiryBlur = (
    { onBlur }: { onBlur?: ?Function } = { onBlur: null }
  ) => (e: SyntheticInputEvent<*>) => {
    const cardExpiry = e.target.value.split(' / ').join('/');
    const expiryError = isExpiryInvalid(cardExpiry);
    if (expiryError) {
      this.setFieldInvalid(expiryError, { state: 'ccExpDateErrorText' });
    }

    const { cardExpiryInputProps } = this.props;
    cardExpiryInputProps.onBlur && cardExpiryInputProps.onBlur(e);
    onBlur && onBlur(e);
  };

  handleCardExpiryChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    const cardExpiry = e.target.value.split(' / ').join('/');

    this.cardExpiryField.value = formatExpiry(cardExpiry);

    this.setFieldValid({ state: 'ccExpDateErrorText' });

    const expiryError = isExpiryInvalid(cardExpiry);
    if (cardExpiry.length > 4) {
      if (expiryError) {
        this.setFieldInvalid(expiryError, {
          state: 'ccExpDateErrorText'
        });
      } else {
        this.cvcField.focus();
      }
    }

    const { cardExpiryInputProps } = this.props;
    cardExpiryInputProps.onChange && cardExpiryInputProps.onChange(e);
    onChange && onChange(e);
  };

  handleCardExpiryKeyPress = (e: any) => {
    const value = e.target.value;
    this.checkIsNumeric(e);
    if (value && !isHighlighted()) {
      const valueLength = value.split(' / ').join('').length;
      if (valueLength >= 4) {
        e.preventDefault();
      }
    }
  };

  handleCardCVCBlur = (
    { onBlur }: { onBlur?: ?Function } = { onBlur: null }
  ) => (e: SyntheticInputEvent<*>) => {
    if (!payment.fns.validateCardCVC(e.target.value)) {
      this.setFieldInvalid('CVC is invalid', {
        state: 'ccCIDErrorText'
      });
    }

    const { cardCVCInputProps } = this.props;
    cardCVCInputProps.onBlur && cardCVCInputProps.onBlur(e);
    onBlur && onBlur(e);
  };

  handleCardCVCChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    const CVC = e.target.value;
    const CVCLength = CVC.length;
    const isZipFieldAvailable = this.props.enableZipInput && this.state.showZip;
    const cardType = payment.fns.cardType(this.state.cardNumber);

    this.setFieldValid({
      state: 'ccCIDErrorText'
    });
    if (CVCLength >= 4) {
      if (!payment.fns.validateCardCVC(CVC, cardType)) {
        this.setFieldInvalid('CVC is invalid', {
          state: 'ccCIDErrorText'
        });
      }
    }

    if (isZipFieldAvailable && hasCVCReachedMaxLength(cardType, CVCLength)) {
      this.zipField.focus();
    }

    const { cardCVCInputProps } = this.props;
    cardCVCInputProps.onChange && cardCVCInputProps.onChange(e);
    onChange && onChange(e);
  };

  handleCardCVCKeyPress = (e: any) => {
    const cardType = payment.fns.cardType(this.state.cardNumber);
    const value = e.target.value;
    this.checkIsNumeric(e);
    if (value && !isHighlighted()) {
      const valueLength = value.split(' / ').join('').length;
      if (hasCVCReachedMaxLength(cardType, valueLength)) {
        e.preventDefault();
      }
    }
  };

  handleCardZipBlur = (
    { onBlur }: { onBlur?: ?Function } = { onBlur: null }
  ) => (e: SyntheticInputEvent<*>) => {
    if (!isValidZip(e.target.value)) {
      this.setFieldInvalid('Zip code is invalid', {
        state: 'ccZipErrorText'
      });
    }

    const { cardZipInputProps } = this.props;
    cardZipInputProps.onBlur && cardZipInputProps.onBlur(e);
    onBlur && onBlur(e);
  };

  handleCardZipChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    const zip = e.target.value;
    const zipLength = zip.length;

    this.setFieldValid({
      state: 'ccZipErrorText'
    });

    if (zipLength >= 5 && !isValidZip(zip)) {
      this.setFieldInvalid('Zip code is invalid', {
        state: 'ccZipErrorText'
      });
    }

    const { cardZipInputProps } = this.props;
    cardZipInputProps.onChange && cardZipInputProps.onChange(e);
    onChange && onChange(e);
  };

  handleCardZipKeyPress = (e: any) => {
    const cardType = payment.fns.cardType(this.state.cardNumber);
    const value = e.target.value;
    this.checkIsNumeric(e);
    if (value && !isHighlighted()) {
      const valueLength = value.split(' / ').join('').length;
      if (hasZipReachedMaxLength(cardType, valueLength)) {
        e.preventDefault();
      }
    }
  };

  handleKeyDown = (ref: any) => {
    return (e: SyntheticInputEvent<*>) => {
      if (e.keyCode === BACKSPACE_KEY_CODE && !e.target.value) {
        ref.focus();
      }
    };
  };

  setFieldInvalid = (errorText: string, mapState: Object) => {
    const { invalidClassName, afterValidateCard, translator } = this.props;

    const mainWrapper = document.getElementById('field-wrapper');
    mainWrapper && mainWrapper.classList.add(invalidClassName);

    const fieldWrapper = document.getElementById(
      mapState['state'].replace('ErrorText', '')
    );
    fieldWrapper && fieldWrapper.classList.add(invalidClassName);

    this.setState({
      errorText: translator[errorText] || errorText,
      [mapState['state']]: errorText
    });
    afterValidateCard && afterValidateCard(false);
  };

  setFieldValid = mapState => {
    const { invalidClassName, afterValidateCard } = this.props;
    const mainWrapper = document.getElementById('field-wrapper');
    mainWrapper && mainWrapper.classList.remove(invalidClassName);

    const fieldWrapper = document.getElementById(
      mapState['state'].replace('ErrorText', '')
    );
    fieldWrapper && fieldWrapper.classList.remove(invalidClassName);

    this.setState({ errorText: null, [mapState['state']]: null });

    afterValidateCard && afterValidateCard(true);
  };

  /**
   *
   * @return {string}
   */
  getType = () => {
    let cardType = payment.fns.cardType(this.state.cardNumber);
    return cardType.charAt(0).toUpperCase() + cardType.slice(1);
  };

  render = () => {
    const { cardImage, errorText, showZip } = this.state;
    const {
      cardImageClassName,
      cardImageStyle,
      cardCVCInputProps,
      cardZipInputProps,
      cardExpiryInputProps,
      cardNumberInputProps,
      cardCVCInputRenderer,
      cardExpiryInputRenderer,
      cardNumberInputRenderer,
      cardZipInputRenderer,
      containerClassName,
      containerStyle,
      dangerTextClassName,
      dangerTextStyle,
      enableZipInput,
      fieldClassName,
      fieldStyle,
      inputClassName,
      inputStyle,
      invalidStyle
    } = this.props;
    const isZipEnabled = enableZipInput && showZip;

    return (
      <Container className={containerClassName} styled={containerStyle}>
        <FieldWrapper
          id="field-wrapper"
          className={fieldClassName}
          styled={fieldStyle}
          invalidStyled={invalidStyle}
        >
          <CardImage
            className={cardImageClassName}
            styled={cardImageStyle}
            src={cardImage}
          />
          <InputWrapper
            inputStyled={inputStyle}
            data-max="9999 9999 9999 9999 9999"
            translateXForZip={true}
          >
            {cardNumberInputRenderer({
              handleCardNumberChange: onChange =>
                this.handleCardNumberChange({ onChange }),
              handleCardNumberBlur: onBlur =>
                this.handleCardNumberBlur({ onBlur }),
              props: {
                id: 'card-number',
                ref: cardNumberField => {
                  this.cardNumberField = cardNumberField;
                },
                autoComplete: 'cc-number',
                className: `credit-card-input ${inputClassName}`,
                pattern: '[0-9]*',
                placeholder: 'Card number',
                type: 'text',
                ...cardNumberInputProps,
                onBlur: this.handleCardNumberBlur(),
                onChange: this.handleCardNumberChange(),
                onKeyPress: this.handleCardNumberKeyPress
              }
            })}
          </InputWrapper>
          <InputWrapper
            inputStyled={inputStyle}
            data-max="MM / YY 9"
            translateXForZip={isZipEnabled}
          >
            {cardExpiryInputRenderer({
              handleCardExpiryChange: onChange =>
                this.handleCardExpiryChange({ onChange }),
              handleCardExpiryBlur: onBlur =>
                this.handleCardExpiryBlur({ onBlur }),
              props: {
                id: 'card-expiry',
                ref: cardExpiryField => {
                  this.cardExpiryField = cardExpiryField;
                },
                autoComplete: 'cc-exp',
                className: `credit-card-input ${inputClassName}`,
                pattern: '[0-9]*',
                placeholder: 'MM/YY',
                type: 'text',
                ...cardExpiryInputProps,
                onBlur: this.handleCardExpiryBlur(),
                onChange: this.handleCardExpiryChange(),
                onKeyDown: this.handleKeyDown(this.cardNumberField),
                onKeyPress: this.handleCardExpiryKeyPress
              }
            })}
          </InputWrapper>
          <InputWrapper
            inputStyled={inputStyle}
            data-max="99999"
            translateXForZip={isZipEnabled}
          >
            {cardCVCInputRenderer({
              handleCardCVCChange: onChange =>
                this.handleCardCVCChange({ onChange }),
              handleCardCVCBlur: onBlur => this.handleCardCVCBlur({ onBlur }),
              props: {
                id: 'cvc',
                ref: cvcField => {
                  this.cvcField = cvcField;
                },
                autoComplete: 'off',
                className: `credit-card-input ${inputClassName}`,
                pattern: '[0-9]*',
                placeholder: 'CVC',
                type: 'text',
                ...cardCVCInputProps,
                onBlur: this.handleCardCVCBlur(),
                onChange: this.handleCardCVCChange(),
                onKeyDown: this.handleKeyDown(this.cardExpiryField),
                onKeyPress: this.handleCardCVCKeyPress
              }
            })}
          </InputWrapper>
          <InputWrapper data-max="999999" translateXForZip={isZipEnabled}>
            {cardZipInputRenderer({
              handleCardZipChange: onChange =>
                this.handleCardZipChange({ onChange }),
              handleCardZipBlur: onBlur => this.handleCardZipBlur({ onBlur }),
              props: {
                id: 'zip',
                ref: zipField => {
                  this.zipField = zipField;
                },
                className: `credit-card-input zip-input ${inputClassName}`,
                pattern: '[0-9]*',
                placeholder: 'Zip',
                type: 'text',
                ...cardZipInputProps,
                onBlur: this.handleCardZipBlur(),
                onChange: this.handleCardZipChange(),
                onKeyDown: this.handleKeyDown(this.cvcField),
                onKeyPress: this.handleCardZipKeyPress
              }
            })}
          </InputWrapper>
        </FieldWrapper>
        {errorText && (
          <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
            {errorText}
          </DangerText>
        )}
      </Container>
    );
  };
}

export default CreditCardInput;

export class CreditCardForm extends CreditCardInput {
  render = () => {
    const {
      showZip,
      ccNumberErrorText,
      ccExpDateErrorText,
      ccCIDErrorText,
      ccZipErrorText
    } = this.state;
    const {
      cardCVCInputProps,
      cardZipInputProps,
      cardExpiryInputProps,
      cardNumberInputProps,
      cardCVCInputRenderer,
      cardExpiryInputRenderer,
      cardNumberInputRenderer,
      cardZipInputRenderer,
      containerClassName,
      containerStyle,
      dangerTextClassName,
      dangerTextStyle,
      enableZipInput,
      fieldClassName,
      fieldStyle,
      inputClassName,
      inputStyle,
      invalidStyle
    } = this.props;
    const isZipEnabled = enableZipInput && showZip;

    return (
      <Container
        className={containerClassName}
        styled={{ ...containerStyle, display: 'block' }}
      >
        <FormFieldWrapper
          className={fieldClassName}
          styled={fieldStyle}
          invalidStyled={invalidStyle}
        >
          <FormFieldLabel>{'Name on card'}</FormFieldLabel>
          <FormInputWrapper
            inputStyled={inputStyle}
            translateXForZip={true}
            data-max="9999"
          >
            {inputRenderer({
              props: {
                id: 'name-on-card',
                ref: cardNameField => {
                  this.cardNameField = cardNameField;
                },
                className: `credit-card-input ${inputClassName}`,
                placeholder: '',
                type: 'text',
                autoComplete: 'cc-name'
              }
            })}
          </FormInputWrapper>
        </FormFieldWrapper>
        <DangerText className={dangerTextClassName} styled={dangerTextStyle} />
        <FormFieldWrapper
          id="ccNumber"
          className={fieldClassName}
          styled={fieldStyle}
          invalidStyled={invalidStyle}
        >
          <FormFieldLabel>{'Card number'}</FormFieldLabel>
          <FormInputWrapper
            inputStyled={inputStyle}
            data-max="9999 9999 9999 9999 9999"
            translateXForZip={true}
          >
            {cardNumberInputRenderer({
              handleCardNumberChange: onChange =>
                this.handleCardNumberChange({ onChange }),
              handleCardNumberBlur: onBlur =>
                this.handleCardNumberBlur({ onBlur }),
              props: {
                id: 'card-number',
                ref: cardNumberField => {
                  this.cardNumberField = cardNumberField;
                },
                autoComplete: 'cc-number',
                className: `credit-card-input ${inputClassName}`,
                pattern: '[0-9]*',
                placeholder: '',
                type: 'text',
                ...cardNumberInputProps,
                onBlur: this.handleCardNumberBlur(),
                onChange: this.handleCardNumberChange(),
                onKeyPress: this.handleCardNumberKeyPress
              }
            })}
          </FormInputWrapper>
        </FormFieldWrapper>
        <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
          {ccNumberErrorText}
        </DangerText>
        <FormFieldWrapper
          id="ccExpDate"
          className={fieldClassName}
          styled={fieldStyle}
          invalidStyled={invalidStyle}
        >
          <FormFieldLabel>{'Expiration Date'}</FormFieldLabel>
          <FormInputWrapper
            inputStyled={inputStyle}
            data-max="MM / YY 9"
            translateXForZip={true}
          >
            {cardExpiryInputRenderer({
              handleCardExpiryChange: onChange =>
                this.handleCardExpiryChange({ onChange }),
              handleCardExpiryBlur: onBlur =>
                this.handleCardExpiryBlur({ onBlur }),
              props: {
                id: 'card-expiry',
                ref: cardExpiryField => {
                  this.cardExpiryField = cardExpiryField;
                },
                autoComplete: 'cc-exp',
                className: `credit-card-input ${inputClassName}`,
                pattern: '[0-9]*',
                placeholder: 'MM/YY',
                type: 'text',
                ...cardExpiryInputProps,
                onBlur: this.handleCardExpiryBlur(),
                onChange: this.handleCardExpiryChange(),
                onKeyDown: this.handleKeyDown(this.cardNumberField),
                onKeyPress: this.handleCardExpiryKeyPress
              }
            })}
          </FormInputWrapper>
        </FormFieldWrapper>
        <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
          {ccExpDateErrorText}
        </DangerText>
        <FormFieldWrapper
          id="ccCID"
          className={fieldClassName}
          styled={fieldStyle}
          invalidStyled={invalidStyle}
        >
          <FormFieldLabel>{'CSC'}</FormFieldLabel>
          <FormInputWrapper
            inputStyled={inputStyle}
            data-max="99999"
            translateXForZip={true}
          >
            {cardCVCInputRenderer({
              handleCardCVCChange: onChange =>
                this.handleCardCVCChange({ onChange }),
              handleCardCVCBlur: onBlur => this.handleCardCVCBlur({ onBlur }),
              props: {
                id: 'cvc',
                ref: cvcField => {
                  this.cvcField = cvcField;
                },
                autoComplete: 'off',
                className: `credit-card-input ${inputClassName}`,
                pattern: '[0-9]*',
                placeholder: '',
                type: 'text',
                ...cardCVCInputProps,
                onBlur: this.handleCardCVCBlur(),
                onChange: this.handleCardCVCChange(),
                onKeyDown: this.handleKeyDown(this.cardExpiryField),
                onKeyPress: this.handleCardCVCKeyPress
              }
            })}
          </FormInputWrapper>
        </FormFieldWrapper>
        <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
          {ccCIDErrorText}
        </DangerText>
        {enableZipInput && (
          <Fragment>
            <FormFieldWrapper
              id="ccZip"
              className={fieldClassName}
              styled={fieldStyle}
              invalidStyled={invalidStyle}
            >
              <FormFieldLabel>{'Zip'}</FormFieldLabel>
              <FormInputWrapper
                data-max="999999"
                translateXForZip={isZipEnabled}
              >
                {cardZipInputRenderer({
                  handleCardZipChange: onChange =>
                    this.handleCardZipChange({ onChange }),
                  handleCardZipBlur: onBlur =>
                    this.handleCardZipBlur({ onBlur }),
                  props: {
                    id: 'zip',
                    ref: zipField => {
                      this.zipField = zipField;
                    },
                    className: `credit-card-input zip-input ${inputClassName}`,
                    pattern: '[0-9]*',
                    placeholder: 'Zip',
                    type: 'text',
                    ...cardZipInputProps,
                    onBlur: this.handleCardZipBlur(),
                    onChange: this.handleCardZipChange(),
                    onKeyDown: this.handleKeyDown(this.cvcField),
                    onKeyPress: this.handleCardZipKeyPress
                  }
                })}
              </FormInputWrapper>
            </FormFieldWrapper>
            <DangerText
              className={dangerTextClassName}
              styled={dangerTextStyle}
            >
              {ccZipErrorText}
            </DangerText>
          </Fragment>
        )}
      </Container>
    );
  };
}
