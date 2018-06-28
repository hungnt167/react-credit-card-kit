// @flow
import 'babel-polyfill';
import React, { Fragment } from 'react';
import { CreditCardInput } from './CreditCardInput';

import { DangerText } from './utils/styles';

export class CreditCardFormNPayViaEmail extends CreditCardInput {
  toggleMode = async () => {
    await this.setState({
      isCardMode: !this.state.isCardMode
    });

    const { afterValidateCard } = this.props;
    afterValidateCard && afterValidateCard(this.formIsValid());
  };

  isEmail = email => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  handleEmailBlur = ({ onBlur }: { onBlur?: ?Function } = { onBlur: null }) => (
    e: SyntheticInputEvent<*>
  ) => {
    if (!this.isEmail(e.target.value)) {
      this.setFieldInvalid('email is invalid', {
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
      this.setFieldInvalid('email is invalid', {
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
      ccEmailErrorText
    } = this.state;
    const {
      cardCVCInputProps,
      cardZipInputProps,
      cardExpiryInputProps,
      cardNumberInputProps,
      cardNameInputProps,
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
      <Fragment>
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
            <div className="form-group">
              <label>Name on Card</label>
              {this.inputRenderer({
                props: {
                  id: 'name-on-card',
                  ref: cardNameField => {
                    this.cardNameField = cardNameField;
                  },
                  className: `form-control ${inputClassName}`,
                  placeholder: '',
                  type: 'text',
                  autoComplete: 'cc-name',
                  ...cardNameInputProps
                }
              })}
            </div>
            <div className="row">
              <div className="col-xs-8">
                <div className="form-group last">
                  <label>Card Number</label>
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
                      autoComplete: 'cc-number',
                      className: `form-control ${inputClassName}`,
                      pattern: '[0-9]*',
                      placeholder: '',
                      type: 'text',
                      ...cardNumberInputProps,
                      onBlur: this.handleCardNumberBlur(),
                      onChange: this.handleCardNumberChange(),
                      onKeyPress: this.handleCardNumberKeyPress
                    }
                  })}
                </div>
              </div>
              <div className="col-xs-2">
                <div className="form-group last">
                  <label>Exp Date</label>
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
                      autoComplete: 'cc-exp',
                      className: `form-control ${inputClassName}`,
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
                </div>
              </div>
              <div className="col-xs-2">
                <div className="form-group last">
                  <label>CSC</label>
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
                      onKeyPress: this.handleCardCVCKeyPress
                    }
                  })}
                </div>
              </div>
            </div>
            {enableZipInput && (
              <div className="row">
                <div className="col-xs-2">
                  <label>Zip</label>
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
              <label>Email</label>
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
      </Fragment>
    );
  };
}
