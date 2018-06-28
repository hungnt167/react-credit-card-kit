// @flow

import React, { Component, Fragment } from 'react';
import { CreditCardInput } from './CreditCardInput';
import styled from 'styled-components';

import {
	Container,
	FieldWrapper,
	CardImage,
	InputWrapper,
	DangerText
} from './utils/styles';

export class CreditCardForm extends CreditCardInput {
	render = () => {
    const { errorText, showZip } = this.state;
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
      inputClassName,
    } = this.props;
    const isZipEnabled = enableZipInput && showZip;

    return (
					<div className={containerClassName} styled={containerStyle}>
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
				                autoComplete: 'cc-name'
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
						              handleCardCVCBlur: onBlur => this.handleCardCVCBlur({ onBlur }),
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
					              handleCardZipBlur: onBlur => this.handleCardZipBlur({ onBlur }),
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
	                    </div>)}
	                    {showError && errorText && (
				          <DangerText className={dangerTextClassName} styled={dangerTextStyle}>
				            {errorText}
				          </DangerText>)}
					</div>
    )
  };
}