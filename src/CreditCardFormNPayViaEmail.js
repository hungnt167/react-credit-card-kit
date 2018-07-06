// @flow
import 'babel-polyfill';
import React from 'react';
import { CreditCardForm } from './CreditCardForm';

import {
  DangerText,
  ErrorValidationElement,
  HiddenNumberStyle,
  NumberWrapper,
  CIDWrapper,
  Label
} from './utils/styles';

export class CreditCardFormNPayViaEmail extends CreditCardForm {
  toggleMode = async () => {
    await this.setState({
      isCardMode: !this.state.isCardMode
    });

    const { afterValidateCard } = this.props;
    afterValidateCard && afterValidateCard(this.formIsValid());
  };

  isEmail = email => {
    let re = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return re.test(String(email).toLowerCase());
  };

  handleEmailBlur = ({ onBlur }: { onBlur?: ?Function } = { onBlur: null }) => (
    e: SyntheticInputEvent<*>
  ) => {
    const { value } = e.target;
    if (!this.isEmail(value)) {
      let message = value.length
        ? 'Please enter a valid email address'
        : 'This is a required filed';
      this.setFieldInvalid(message, {
        state: 'ccEmailErrorText'
      });
    }
    const { emailInputProps } = this.props;
    emailInputProps.onBlur && emailInputProps.onBlur(e);
    onBlur && onBlur(e);
  };

  handleEmailChange = (
    { onChange }: { onChange?: ?Function } = { onChange: null }
  ) => (e: SyntheticInputEvent<*>) => {
    if (!this.isEmail(e.target.value)) {
      this.setFieldInvalid('Please enter a valid email address', {
        state: 'ccEmailErrorText'
      });
    } else {
      this.setFieldValid({ state: 'ccEmailErrorText' });
    }

    const { emailInputProps } = this.props;
    emailInputProps.onChange && emailInputProps.onChange(e);
    onChange && onChange(e);
  };

  handleEmailKeyPress = (e: any) => {};

  render = () => {
    const {
      ccNumberErrorText,
      ccExpDateErrorText,
      ccCIDErrorText,
      ccZipErrorText,
      ccEmailErrorText,
      isReadyToSwipe
    } = this.state;
    const {
      cardCVCInputProps,
      cardZipInputProps,
      cardExpiryInputProps,
      cardNumberInputProps,
      emailInputProps,
      cardCVCInputRenderer,
      cardExpiryInputRenderer,
      cardNumberInputRenderer,
      cardZipInputRenderer,
      containerClassName,
      containerStyle,
      controlClassName,
      showError,
      dangerTextClassName,
      dangerTextStyle,
      enableZipInput,
      inputClassName,
      translator
    } = this.props;

    return (
      <div className={containerClassName} styled={containerStyle}>
        <input
          type="checkbox"
          name=""
          id={controlClassName}
          className={controlClassName}
        />
        <label
          className="toggle"
          htmlFor={controlClassName}
          onClick={this.toggleMode}
        >
          <span className="text-left custom-control-label">
            {translator['Pay by Card']
              ? translator['Pay by Card']
              : 'Pay by Card'}
          </span>
          <span className="text-right custom-control-label">
            {translator['Pay by Email']
              ? translator['Pay by Email']
              : 'Pay by Email'}
          </span>
        </label>

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
                type: 'text',
                autoComplete: 'off',
                style: { textTransform: 'uppercase' },
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
                      type: 'text',
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
                      tabIndex: '-1',
                      autoComplete: 'off',
                      type: 'text'
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
          {showError && (
            <DangerText
              className={dangerTextClassName}
              styled={dangerTextStyle}
            >
              {ccNumberErrorText ||
                ccExpDateErrorText ||
                ccCIDErrorText ||
                ccZipErrorText}
            </DangerText>
          )}
        </div>
        <div role="tabpanel" className="tab-pane by-email">
          <div className="form-group last">
            <Label onClick={() => this.emailField.focus()}>
              {this.translate('Email')}
            </Label>
            {this.inputRenderer({
              props: {
                id: 'ccEmail',
                ref: emailField => {
                  this.emailField = emailField;
                },
                className: `form-control ${inputClassName}`,
                placeholder: 'email@company.com',
                type: 'email',
                ...emailInputProps,
                onBlur: this.handleEmailBlur(),
                onChange: this.handleEmailChange(),
                onKeyDown: this.handleKeyDown(this.emailField),
                onKeyPress: this.handleEmailKeyPress
              }
            })}
            <ErrorValidationElement context={this} field={'ccEmail'} />
          </div>
          {showError && (
            <DangerText
              className={dangerTextClassName}
              styled={dangerTextStyle}
            >
              {ccEmailErrorText}
            </DangerText>
          )}
        </div>
      </div>
    );
  };
}
