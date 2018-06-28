// @flow

import React, { Fragment } from 'react';
import { CreditCardInput } from './CreditCardInput';

import {
  Container,
  FormFieldWrapper,
  FormFieldLabel,
  FormInputWrapper,
  DangerText
} from './utils/styles';

export class CreditCardFullForm extends CreditCardInput {
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
            {this.inputRenderer({
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
        {showError && (
          <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
            {ccNumberErrorText}
          </DangerText>
        )}
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
        {showError && (
          <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
            {ccExpDateErrorText}
          </DangerText>
        )}
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
        {showError && (
          <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
            {ccCIDErrorText}
          </DangerText>
        )}
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
            {showError && (
              <DangerText
                className={dangerTextClassName}
                styled={dangerTextStyle}
              >
                {ccZipErrorText}
              </DangerText>
            )}
          </Fragment>
        )}
      </Container>
    );
  };
}
