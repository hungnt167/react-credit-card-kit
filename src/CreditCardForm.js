// @flow

import React from 'react';
import { CreditCardInput } from './CreditCardInput';

import {
  DangerText,
  ErrorValidationElement,
  HiddenNumberStyle,
  NumberWrapper,
  CIDWrapper,
  Label
} from './utils/styles';
import { Cardswipe } from './utils/cardswipe';

export class CreditCardForm extends CreditCardInput {
  initialShowDetailError = {
    ccNumber: null,
    ccExpDate: null,
    ccCID: null,
    ccZip: null
  };

  cardHiddenNumberField;
  cardswipe;

  constructor(props) {
    super(props);
    this.state.isReadyToSwipe = false;
    this.state.showDetailError = { ...this.initialShowDetailError };

    this.cardswipe = new Cardswipe();
  }

  setFieldInvalid = (errorText: string, mapState: Object) => {
    const { afterValidateCard } = this.props;

    this.setState({
      errorText: this.translate(errorText),
      [mapState['state']]: this.translate(errorText)
    });
    afterValidateCard && afterValidateCard(false);
  };

  setFieldValid = mapState => {
    const { afterValidateCard } = this.props;

    this.setState({ errorText: null, [mapState['state']]: null });

    afterValidateCard && afterValidateCard(this.formIsValid(mapState['state']));
  };

  showDetailError = field => {
    //hide all
    let originShowDetailError = { ...this.initialShowDetailError };
    originShowDetailError[field] = !this.state.showDetailError[field];
    this.setState({ showDetailError: originShowDetailError });
  };

  toggleSwipe = e => {
    e.preventDefault();
    if (!this.state.isReadyToSwipe) {
      this.setState({
        cardNumberLength: 0,
        cardNumber: null,
        ccNumberErrorText: null,
        ccExpDateErrorText: null,
        ccCIDErrorText: null,
        ccZipErrorText: null
      });

      this.cardHiddenNumberField && (this.cardHiddenNumberField.value = '');
      this.cardHiddenNumberField && this.cardHiddenNumberField.focus();
      this.cardNameField && (this.cardNameField.value = '');
      this.cardNumberField && (this.cardNumberField.value = '');
      this.cardNumberdMaskedField && (this.cardNumberdMaskedField.value = '');
      this.cardNumberdUnmaskedField &&
        (this.cardNumberdUnmaskedField.value = '');
      this.cardExpiryField && (this.cardExpiryField.value = '');
      this.cvcField && (this.cvcField.value = '');
      this.cvcMaskedField && (this.cvcMaskedField.value = '');
    }
    this.setState({ isReadyToSwipe: !this.state.isReadyToSwipe });
  };

  setCard = async card => {
    await this.setState({
      isCardMode: true
    });
    let expiry = `${card.exp_month}/${card.exp_year.substring(2)}`;
    this.cardNameField.value = card.name;
    this.cardNumberField.value = card.number;
    this.handleCardNumberChange()({ target: { value: card.number } });
    this.handleCardNumberBlur()({ target: { value: card.number } });
    this.cardExpiryField.value = expiry;
    this.handleCardExpiryChange()({ target: { value: expiry } });
    this.handleCardExpiryBlur()({ target: { value: expiry } });
    this.cvcField.value = card.cvc;
    this.handleCardCVCChange()({ target: { value: card.cvc } });
    this.handleCardCVCBlur()({ target: { value: card.cvc } });
  };

  handleCardHiddenNumberKeyUp = async event => {
    if (event.keyCode === 13) {
      let ccinfo = this.cardswipe.parseSwiperData(
        this.cardHiddenNumberField.value
      );
      if (ccinfo === -1) return;
      let expiry = `${ccinfo.exp_month}/${ccinfo.exp_year.substring(2)}`;
      this.cardNameField.value = ccinfo.name;
      this.cardNumberField.value = ccinfo.number;
      this.handleCardNumberChange()({ target: { value: ccinfo.number } });
      this.handleCardNumberBlur()({ target: { value: ccinfo.number } });
      this.cardExpiryField.value = expiry;
      this.handleCardExpiryChange()({ target: { value: expiry } });
      this.handleCardExpiryBlur()({ target: { value: expiry } });
      this.cvcField.focus();
      this.setState({ isReadyToSwipe: !this.state.isReadyToSwipe });
    }
  };

  handleCardNameKeyUp = async event => {
    if (event.keyCode === 13) {
      this.cardNumberField && this.cardNumberField.focus();
    }
  };

  handleCardNumberKeyUp = async event => {
    if (event.keyCode === 13) {
      this.cardExpiryField && this.cardExpiryField.focus();
    }
  };

  handleCardExpiryKeyUp = async event => {
    if (event.keyCode === 13) {
      this.cvcField && this.cvcField.focus();
    }
  };

  handleCardCVCKeyUp = async event => {
    if (event.keyCode === 13) {
      this.zipField && this.zipField.focus();
    }
  };

  render = () => {
    const { errorText, isReadyToSwipe } = this.state;
    const {
      cardNameInputProps,
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
      inputClassName
    } = this.props;

    return (
      <div className={containerClassName} styled={containerStyle}>
        <div role="tabpanel" className="tab-pane by-card">
          <div className="button-swipe">
            <button
              className={'btn ' + (isReadyToSwipe ? 'active' : '')}
              onClick={this.toggleSwipe}
            >
              {isReadyToSwipe
                ? this.translate('Ready to swipe')
                : this.translate('Click to swipe card')}
            </button>
          </div>
          <div className="form-group">
            <Label onClick={() => this.cardNameField.focus()}>
              {this.translate('Name on Card')}
            </Label>
            {this.inputRenderer({
              props: {
                id: 'name-on-card',
                ref: cardNameField => {
                  this.cardNameField = cardNameField;
                },
                className: `form-control ${inputClassName}`,
                placeholder: '',
                type: 'text',
                style: { textTransform: 'uppercase' },
                autoComplete: 'off',
                ...cardNameInputProps,
                onKeyUp: this.handleCardNameKeyUp
              }
            })}
          </div>
          <div className="row">
            <div className="col-xs-8">
              <div className="form-group last">
                <Label onClick={() => this.cardNumberField.focus()}>
                  {this.translate('Card Number')}
                </Label>
                <NumberWrapper>
                  {this.inputRenderer({
                    props: {
                      id: 'ccHiddenNumber',
                      ref: cardHiddenNumberField => {
                        this.cardHiddenNumberField = cardHiddenNumberField;
                      },
                      tabIndex: '-1',
                      autoComplete: 'off',
                      className: `cc-hidden-number`,
                      style: HiddenNumberStyle,
                      placeholder: '',
                      type: 'text',
                      onKeyUp: this.handleCardHiddenNumberKeyUp
                    }
                  })}
                  {cardNumberInputRenderer({
                    handleCardNumberChange: onChange =>
                      this.handleCardNumberChange({ onChange }),
                    handleCardNumberBlur: onBlur =>
                      this.handleCardNumberBlur({ onBlur }),
                    props: {
                      id: 'ccNumber',
                      ref: cardNumberField => {
                        this.cardNumberField = cardNumberField;
                      },
                      autoComplete: 'off',
                      className: `form-control ${inputClassName}`,
                      type: 'text',
                      ...cardNumberInputProps,
                      onBlur: this.handleCardNumberBlur(),
                      onChange: this.handleCardNumberChange(),
                      onKeyPress: this.handleCardNumberKeyPress,
                      onKeyUp: this.handleCardNumberKeyUp
                    }
                  })}
                  {this.inputRenderer({
                    props: {
                      id: 'ccNumberdMasked',
                      ref: cardNumberdMaskedField => {
                        this.cardNumberdMaskedField = cardNumberdMaskedField;
                      },
                      tabIndex: '-1',
                      autoComplete: 'off',
                      type: 'text'
                    }
                  })}
                  {this.inputRenderer({
                    props: {
                      id: 'ccNumberdUnmasked',
                      ref: cardNumberdUnmaskedField => {
                        this.cardNumberdUnmaskedField = cardNumberdUnmaskedField;
                      },
                      type: 'text',
                      tabIndex: '-1',
                      autoComplete: 'off',
                      readOnly: true
                    }
                  })}
                </NumberWrapper>
                <ErrorValidationElement context={this} field={'ccNumber'} />
              </div>
            </div>
            <div className="col-xs-2">
              <div className="form-group last">
                <Label onClick={() => this.cardExpiryField.focus()}>
                  {this.translate('Exp Date')}
                </Label>
                {cardExpiryInputRenderer({
                  handleCardExpiryChange: onChange =>
                    this.handleCardExpiryChange({ onChange }),
                  handleCardExpiryBlur: onBlur =>
                    this.handleCardExpiryBlur({ onBlur }),
                  props: {
                    id: 'ccExpDate',
                    ref: cardExpiryField => {
                      this.cardExpiryField = cardExpiryField;
                    },
                    autoComplete: 'off',
                    className: `form-control ${inputClassName}`,
                    placeholder: 'MM/YY',
                    type: 'text',
                    ...cardExpiryInputProps,
                    onBlur: this.handleCardExpiryBlur(),
                    onChange: this.handleCardExpiryChange(),
                    onKeyDown: this.handleKeyDown(this.cardNumberField),
                    onKeyPress: this.handleCardExpiryKeyPress,
                    onKeyUp: this.handleCardExpiryKeyUp
                  }
                })}
                <ErrorValidationElement context={this} field={'ccExpDate'} />
              </div>
            </div>
            <div className="col-xs-2">
              <div className="form-group last">
                <Label onClick={() => this.cvcField.focus()}>
                  {this.translate('CSC')}
                </Label>
                <CIDWrapper>
                  {cardCVCInputRenderer({
                    handleCardCVCChange: onChange =>
                      this.handleCardCVCChange({ onChange }),
                    handleCardCVCBlur: onBlur =>
                      this.handleCardCVCBlur({ onBlur }),
                    props: {
                      id: 'ccCID',
                      ref: cvcField => {
                        this.cvcField = cvcField;
                      },
                      autoComplete: 'off',
                      className: `form-control ${inputClassName}`,
                      pattern: '[0-9]*',
                      placeholder: '',
                      type: 'number',
                      ...cardCVCInputProps,
                      onBlur: this.handleCardCVCBlur(),
                      onChange: this.handleCardCVCChange(),
                      onKeyDown: this.handleKeyDown(this.cardExpiryField),
                      onKeyPress: this.handleCardCVCKeyPress,
                      onKeyUp: this.handleCardCVCKeyUp
                    }
                  })}
                  {this.inputRenderer({
                    props: {
                      ref: cvcMaskedField => {
                        this.cvcMaskedField = cvcMaskedField;
                      },
                      className: `form-control`,
                      type: 'text',
                      tabIndex: '-1',
                      autoComplete: 'off'
                    }
                  })}
                </CIDWrapper>
                <ErrorValidationElement context={this} field={'ccCID'} />
              </div>
            </div>
          </div>
          {enableZipInput && (
            <div className="row">
              <div className="col-xs-2">
                <Label onClick={() => this.zipField.focus()}>
                  {this.translate('Zip')}
                </Label>
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
                    className: `form-control ${inputClassName}`,
                    pattern: '[0-9]*',
                    placeholder: '',
                    type: 'text',
                    ...cardZipInputProps,
                    onBlur: this.handleCardZipBlur(),
                    onChange: this.handleCardZipChange(),
                    onKeyDown: this.handleKeyDown(this.cvcField),
                    onKeyPress: this.handleCardZipKeyPress
                  }
                })}
                <ErrorValidationElement context={this} field={'ccZip'} />
              </div>
            </div>
          )}
          {showError &&
            errorText && (
              <DangerText
                className={dangerTextClassName}
                styled={dangerTextStyle}
              >
                {errorText}
              </DangerText>
            )}
        </div>
      </div>
    );
  };
}
