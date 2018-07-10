// @flow

import React, { Component } from 'react';
import payment from 'payment';
import creditCardType from 'credit-card-type';
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

import {
  Container,
  FieldWrapper,
  CardImage,
  InputWrapper,
  DangerText
} from './utils/styles';

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
  cardNameInputProps: Object,
  emailInputProps: Object,
  cardImageClassName: string,
  cardImageStyle: Object,
  containerClassName: string,
  containerStyle: Object,
  controlClassName: string,
  showError: boolean,
  showPopoverError: boolean,
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
  translator: Object,
  autoFocus: boolean,
  allowCardTypes: Array
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
  ccZipErrorText: string,
  ccEmailErrorText: string,
  isCardMode: boolean
};

const inputRenderer = ({ props }: Object) => <input {...props} />;

export class CreditCardInput extends Component<Props, State> {
  cardNumberField: any;
  cardExpiryField: any;
  cardNameField: any;
  cardNumberdMaskedField: any;
  cardNumberdUnmaskedField: any;
  cvcField: any;
  cvcMaskedField: any;
  zipField: any;
  emailField: any;
  inputRenderer: any;

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
    cardNameInputProps: {},
    emailInputProps: {},
    cardImageClassName: '',
    cardImageStyle: {},
    containerClassName: '',
    containerStyle: {},
    controlClassName: '',
    showError: true,
    showPopoverError: false,
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
    translator: {},
    autoFocus: true,
    allowCardTypes: []
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
      ccZipErrorText: null,
      ccEmailErrorText: null,
      isCardMode: true
    };
    this.inputRenderer = inputRenderer;
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
    let value = e.target.value;
    const cardType = payment.fns.cardType(this.cardNumberField.value);
    if (!payment.fns.validateCardNumber(value)) {
      let message = value.length
        ? 'Please enter a valid card number'
        : 'This is a required field';

      if (
        cardType &&
        this.props.allowCardTypes.length &&
        this.props.allowCardTypes.indexOf(cardType.toUpperCase()) === -1
      ) {
        message = 'This type card is not supported';
      }

      this.setFieldInvalid(message, {
        state: 'ccNumberErrorText'
      });
    }

    const { cardNumberInputProps, autoFocus } = this.props;
    cardNumberInputProps.onBlur && cardNumberInputProps.onBlur(e);
    onBlur && onBlur(e);

    if (!cardType) {
      return;
    }

    this.updateNumberUnmasked();

    /** check cvc again */
    if (!autoFocus && this.cvcField.value) {
      this.handleCardCVCBlur()({ target: { value: this.cvcField.value } });
    }

    /** show last 4 digit */
    const cardTypeInfo =
      creditCardType.getTypeInfo(creditCardType.types[CARD_TYPES[cardType]]) ||
      {};
    const cardTypeLengths = cardTypeInfo.lengths || [16];

    let ccNumber = value.split(' ').join('');

    if (ccNumber.length < cardTypeLengths[0]) {
      return;
    }

    let fourDigit = (
      '    ' + ccNumber.substring(Math.max(ccNumber.length - 4, 0))
    ).substring(Math.min(ccNumber.length, 4));

    this.cardNumberdUnmaskedField &&
      (this.cardNumberdUnmaskedField.value = fourDigit);
  };

  handleCardNumberChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    let cardNumber = e.target.value;
    let cardNumberLength = cardNumber.split(' ').join('').length;
    const cardType = payment.fns.cardType(cardNumber);
    const cardTypeInfo =
      creditCardType.getTypeInfo(creditCardType.types[CARD_TYPES[cardType]]) ||
      {};
    const cardTypeLengths = cardTypeInfo.lengths || [16];

    if (
      !this.props.autoFocus &&
      cardNumberLength > Math.max(...cardTypeLengths)
    ) {
      cardNumber = cardNumber.substring(0, cardNumber.length - 1);
      cardNumberLength--;
    }

    this.cardNumberField.value = formatCardNumber(cardNumber).replace(
      /[^0-9]+/,
      ''
    );

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
          this.props.autoFocus && this.cardExpiryField.focus();
          break;
        }
        if (cardNumberLength === lastCardTypeLength) {
          this.setFieldInvalid('Please enter a valid card number', {
            state: 'ccNumberErrorText'
          });
        }
      }
    }

    if (
      cardType &&
      this.props.allowCardTypes.length &&
      this.props.allowCardTypes.indexOf(cardType.toUpperCase()) === -1
    ) {
      this.setFieldInvalid('This type card is not supported', {
        state: 'ccNumberErrorText'
      });
    }

    const { cardNumberInputProps } = this.props;
    cardNumberInputProps.onChange && cardNumberInputProps.onChange(e);
    onChange && onChange(e);
    this.updateNumberUnmasked();
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

  updateNumberUnmasked = () => {
    let formattedCcNumber = this.cardNumberField.value;
    let ccNumber = formattedCcNumber.split(' ').join('');

    let numberUnmasked = (
      '    ' + ccNumber.substring(Math.max(ccNumber.length - 4, 0))
    ).substring(Math.min(ccNumber.length, 4));

    numberUnmasked = numberUnmasked.replace(/[0-9]/g, '*');

    this.cardNumberdUnmaskedField &&
      (this.cardNumberdUnmaskedField.value = numberUnmasked);

    this.cardNumberdMaskedField &&
      (this.cardNumberdMaskedField.value = formattedCcNumber
        .substring(4)
        .replace(/[0-9]/g, '*'));
  };

  handleCardExpiryBlur = (
    { onBlur }: { onBlur?: ?Function } = { onBlur: null }
  ) => (e: SyntheticInputEvent<*>) => {
    const cardExpiry = e.target.value.split(' / ').join('/');
    let expiryError = isExpiryInvalid(cardExpiry);

    if (expiryError) {
      if (!cardExpiry.length) {
        expiryError = 'This is a required filed';
      }
      this.setFieldInvalid(expiryError, { state: 'ccExpDateErrorText' });
    }

    const { cardExpiryInputProps } = this.props;
    cardExpiryInputProps.onBlur && cardExpiryInputProps.onBlur(e);
    onBlur && onBlur(e);
  };

  handleCardExpiryChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    let cardExpiry = e.target.value.split(' / ').join('/');

    if (!this.props.autoFocus && cardExpiry.length > 5) {
      cardExpiry = cardExpiry.substring(0, cardExpiry.length - 1);
    }

    this.cardExpiryField.value = formatExpiry(cardExpiry);

    this.setFieldValid({ state: 'ccExpDateErrorText' });

    const expiryError = isExpiryInvalid(cardExpiry);
    if (expiryError) {
      this.setFieldInvalid(expiryError, {
        state: 'ccExpDateErrorText'
      });
    } else {
      this.props.autoFocus && this.cvcField.focus();
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
    const cardType = payment.fns.cardType(this.cardNumberField.value);
    let cvcIsValid = cardType
      ? payment.fns.validateCardCVC(e.target.value, cardType)
      : payment.fns.validateCardCVC(e.target.value);
    if (!cvcIsValid) {
      let message = e.target.value.length
        ? 'Please enter a valid CSC'
        : 'This is a required filed';

      this.setFieldInvalid(message, {
        state: 'ccCIDErrorText'
      });
    }

    const { cardCVCInputProps } = this.props;
    cardCVCInputProps.onBlur && cardCVCInputProps.onBlur(e);
    onBlur && onBlur(e);
    this.updateCIDMasked();
  };

  handleCardCVCChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    let CVC = e.target.value;
    let CVCLength = CVC.length;
    const isZipFieldAvailable = this.props.enableZipInput && this.state.showZip;
    const cardType = payment.fns.cardType(this.cardNumberField.value);

    const cardTypeInfo =
      creditCardType.getTypeInfo(creditCardType.types[CARD_TYPES[cardType]]) ||
      {};

    if (
      Object.keys(cardTypeInfo).length &&
      !this.props.autoFocus &&
      CVCLength > cardTypeInfo.code.size
    ) {
      CVC = CVC.substring(0, CVC.length - 1);
      CVCLength--;
    }

    if (CVCLength) {
      CVC = CVC.replace(/[^0-9]+/, '');
    }

    this.cvcField && (this.cvcField.value = CVC);

    this.setFieldValid({
      state: 'ccCIDErrorText'
    });
    if (!payment.fns.validateCardCVC(CVC, cardType)) {
      this.setFieldInvalid('Please enter a valid CSC', {
        state: 'ccCIDErrorText'
      });
    }

    if (isZipFieldAvailable && hasCVCReachedMaxLength(cardType, CVCLength)) {
      this.props.autoFocus && this.zipField.focus();
    }

    const { cardCVCInputProps } = this.props;
    cardCVCInputProps.onChange && cardCVCInputProps.onChange(e);
    onChange && onChange(e);
    this.updateCIDMasked();
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

  updateCIDMasked = () => {
    this.cvcMaskedField &&
      (this.cvcMaskedField.value = this.cvcField.value.replace(/[0-9]/g, '*'));
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
        this.props.autoFocus && ref.focus();
      }
    };
  };

  setFieldInvalid = (errorText: string, mapState: Object) => {
    const { invalidClassName, afterValidateCard } = this.props;

    const mainWrapper = document.getElementById('field-wrapper');
    mainWrapper && mainWrapper.classList.add(invalidClassName);

    const fieldWrapper = document.getElementById(
      mapState['state'].replace('ErrorText', '')
    );
    fieldWrapper && fieldWrapper.classList.add(invalidClassName);

    this.setState({
      errorText: this.translate(errorText),
      [mapState['state']]: this.translate(errorText)
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

    afterValidateCard && afterValidateCard(this.formIsValid(mapState['state']));
  };

  formIsValid = ignore => {
    if (this.state.isCardMode) {
      let errorList = {
        ccNumberErrorText: this.state.ccNumberErrorText,
        ccExpDateErrorText: this.state.ccExpDateErrorText,
        ccCIDErrorText: this.state.ccCIDErrorText,
        ccZipErrorText: this.state.ccZipErrorText
      };

      let requiredFieldValueList = [
        this.cardNumberField.value,
        this.cardExpiryField.value,
        this.cvcField.value
      ];

      ignore && delete errorList[ignore];

      let isValid = true;

      Object.values(errorList).forEach(errorText => {
        isValid &= !errorText;
      });

      requiredFieldValueList.forEach(value => {
        isValid &= !!value;
      });

      return isValid;
    }

    return !this.state.ccEmailErrorText;
  };

  getType = () => {
    let cardType = payment.fns.cardType(this.state.cardNumber);
    return cardType && cardType.charAt(0).toUpperCase() + cardType.slice(1);
  };

  translate = word => {
    return this.props.translator[word] || word;
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
      showError,
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
        {showError &&
          errorText && (
            <DangerText
              className={dangerTextClassName}
              styled={dangerTextStyle}
            >
              {errorText}
            </DangerText>
          )}
      </Container>
    );
  };
}
