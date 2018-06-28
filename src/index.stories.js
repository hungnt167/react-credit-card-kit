import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import {
  CreditCardInput,
  CreditCardForm,
  CreditCardFullForm,
  CreditCardFormNPayViaEmail
} from '.';
import './index.stories.css';
import './css/bootstrap.min.css';

const Container = styled.div`
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 16px;
  font-variant: normal;
  margin: 0;
  padding: 20px;
  -webkit-font-smoothing: antialiased;
`;

storiesOf('CreditCardInput', module)
  .add('default', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput
        cardCVCInputProps={{
          onBlur: e => console.log('cvc blur', e),
          onChange: e => console.log('cvc change', e)
        }}
        cardExpiryInputProps={{
          onBlur: e => console.log('expiry blur', e),
          onChange: e => console.log('expiry change', e)
        }}
        cardNumberInputProps={{
          onBlur: e => console.log('number blur', e),
          onChange: e => console.log('number change', e)
        }}
      />
    </Container>
  ))
  .add('with zip field enabled', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput enableZipInput />
    </Container>
  ))
  .add('with pre-filled values', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput
        cardCVCInputProps={{ value: '123' }}
        cardExpiryInputProps={{ value: '05 / 21' }}
        cardNumberInputProps={{ value: '4242 4242 4242 4242' }}
      />
    </Container>
  ))
  .add('custom styling (container)', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput
        containerClassName="custom-container"
        containerStyle={{
          backgroundColor: 'gray',
          padding: '20px',
          fontSize: '30px'
        }}
      />
    </Container>
  ))
  .add('custom styling (field wrapper)', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput
        fieldClassName="custom-field"
        fieldStyle={{ padding: '20px', color: 'gray' }}
        invalidClassName="is-invalid-custom"
        invalidStyle={{ border: '3px solid red' }}
      />
    </Container>
  ))
  .add('custom styling (input)', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput
        inputClassName="custom-input"
        inputStyle={{ color: 'red' }}
      />
    </Container>
  ))
  .add('custom styling (danger text)', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput
        dangerTextClassName="custom-danger-text"
        dangerTextStyle={{ color: 'green' }}
        invalidStyle={{ border: '1px solid green' }}
      />
    </Container>
  ))
  .add('custom renderers', () => (
    <Container style={{ backgroundColor: '#f0f0f0' }}>
      <CreditCardInput
        cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
          <input
            {...props}
            onChange={handleCardCVCChange(e => console.log('cvc change', e))}
          />
        )}
        cardExpiryInputRenderer={({ handleCardExpiryChange, props }) => (
          <input
            {...props}
            onChange={handleCardExpiryChange(e =>
              console.log('expiry change', e)
            )}
          />
        )}
        cardNumberInputRenderer={({ handleCardNumberChange, props }) => (
          <input
            {...props}
            onChange={handleCardNumberChange(e =>
              console.log('number change', e)
            )}
          />
        )}
      />
    </Container>
  ));

storiesOf('CreditCardForm', module)
  .add('full form', () => (
    <Container style={{ backgroundColor: '#f0f0f0', width: '50%' }}>
      <CreditCardFullForm
        enableZipInput={false}
        cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
          <input
            {...props}
            onChange={handleCardCVCChange(e => console.log('cvc change', e))}
          />
        )}
        cardExpiryInputRenderer={({ handleCardExpiryChange, props }) => (
          <input
            {...props}
            onChange={handleCardExpiryChange(e =>
              console.log('expiry change', e)
            )}
          />
        )}
        cardNumberInputRenderer={({ handleCardNumberChange, props }) => (
          <input
            {...props}
            onChange={handleCardNumberChange(e =>
              console.log('number change', e)
            )}
          />
        )}
      />
    </Container>
  ))
  .add('form', () => (
    <Container style={{ backgroundColor: '#f0f0f0', width: '50%' }}>
      <CreditCardForm containerClassName="paypal-by" enableZipInput={false} />
    </Container>
  ))
  .add('form and pay via email', () => (
    <Container style={{ backgroundColor: '#f0f0f0', width: '50%' }}>
      <CreditCardFormNPayViaEmail
        containerClassName="paypal-by"
        controlClassName="checkpaypal-by"
        enableZipInput={false}
        afterValidateCard={isValid => console.log(isValid)}
      />
    </Container>
  ));
